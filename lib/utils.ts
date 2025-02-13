import {
  CoreMessage,
  CoreToolMessage,
  generateId,
  Message,
  ToolInvocation,
} from "ai";
import { clsx, type ClassValue } from "clsx";
import { formatDistance, subDays, format, isWithinInterval, startOfMonth } from 'date-fns';
import { twMerge } from "tailwind-merge";

import { Chat } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<CoreMessage>,
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    let toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: generateId(),
      role: message.role,
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export interface ChatTitle {
  text: string;
  hasAttachments: boolean;
}

export function getTitleFromChat(chat: Chat): ChatTitle {
  try {
    // Handle both string and object message formats
    const rawMessages = Array.isArray(chat.messages) 
      ? chat.messages 
      : JSON.parse(chat.messages as string);

    // Convert each message, handling string messages
    const messages = rawMessages.map((msg: Message | string) => {
      const message = typeof msg === 'string' ? JSON.parse(msg) : msg;
      return {
        ...message,
        experimental_attachments: message.experimental_attachments || undefined
      };
    });

    // Check if any message has attachments
    const hasAttachments = messages.some((msg: Message & { experimental_attachments?: Array<{ url: string; name?: string; contentType?: string }> }) => 
      msg.experimental_attachments && msg.experimental_attachments.length > 0
    );

    // Get the first user message for the title
    const firstUserMessage = messages.find((msg: any) => msg.role === 'user');
    if (firstUserMessage && firstUserMessage.content) {
      const content = typeof firstUserMessage.content === 'string' 
        ? firstUserMessage.content 
        : firstUserMessage.content.text || 'Untitled';
      
      return {
        text: content.length > 50 ? content.substring(0, 47) + '...' : content,
        hasAttachments
      };
    }

    return {
      text: 'Untitled',
      hasAttachments
    };
  } catch (e) {
    console.error('Error getting title from chat:', e);
    return {
      text: 'Untitled',
      hasAttachments: false
    };
  }
}

export function groupChatsByDate(chats: Chat[]) {
  const now = new Date();
  const groups: { [key: string]: Chat[] } = {
    'Most Recent': [],
    'Last 7 Days': [],
    'Last 30 Days': [],
  };
  
  const monthGroups = new Map<string, Chat[]>();

  chats.forEach(chat => {
    const chatDate = new Date(chat.updatedAt);
    
    // Most Recent (last 3 days)
    if (isWithinInterval(chatDate, { start: subDays(now, 3), end: now })) {
      groups['Most Recent'].push(chat);
    }
    // Last 7 Days
    else if (isWithinInterval(chatDate, { start: subDays(now, 7), end: subDays(now, 3) })) {
      groups['Last 7 Days'].push(chat);
    }
    // Last 30 Days
    else if (isWithinInterval(chatDate, { start: subDays(now, 30), end: subDays(now, 7) })) {
      groups['Last 30 Days'].push(chat);
    }
    // Group by Month
    else {
      const monthKey = format(chatDate, 'MMMM yyyy');
      if (!monthGroups.has(monthKey)) {
        monthGroups.set(monthKey, []);
      }
      monthGroups.get(monthKey)!.push(chat);
    }
  });

  // Add month groups to the final groups object
  monthGroups.forEach((chats, month) => {
    groups[month] = chats;
  });

  return groups;
}
