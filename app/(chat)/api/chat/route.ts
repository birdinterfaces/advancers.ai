import { promises as fs } from 'fs';
import path from 'path';

import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, Message, streamText, CoreMessage, generateId } from 'ai';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { deleteChatById, getChatById, saveChat, updateUser, getUser, updateUserUsage } from '@/db/queries';
import { getRelevantKnowledge } from '@/lib/knowledge';
import { Model, models } from '@/lib/model';
import { calculateCost, hasExceededLimit, getNextResetDate } from '@/lib/usage';

export const maxDuration = 60; // Set max duration for Vercel functions (Hobby plan limit)

// Create xAI provider instance
const xai = createOpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY ?? '',
});

// User-specific knowledge content cache
const userKnowledgeCache = new Map<string, string>();

// Function to get summarized/processed knowledge content for a specific user
async function getProcessedKnowledgeContent(userId: string) {
  if (userKnowledgeCache.has(userId)) {
    return userKnowledgeCache.get(userId)!;
  }
  
  const knowledgeBasePath = path.join(process.cwd(), 'data', 'knowledgeAdvancers');
  try {
    const content = await fs.readFile(knowledgeBasePath, 'utf8');
    // Here you could add processing to reduce token usage, for example:
    // - Summarize key points
    // - Extract relevant sections
    // - Remove redundant information
    userKnowledgeCache.set(userId, content);
    return content;
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    return '';
  }
}

function getContextFromKnowledge(userMessage: string, knowledgeContent: string) {
  const paragraphs = knowledgeContent.split('\n\n');
  const relevantParagraphs = paragraphs.filter(p => 
    userMessage.toLowerCase().split(' ').some(word => 
      p.toLowerCase().includes(word)
    )
  );
  
  // Return all relevant paragraphs joined together
  return relevantParagraphs.join('\n\n');
}

function estimateTokens(text: string): number {
  // GPT models typically use ~4 characters per token on average
  // But this can vary based on the content. Here's a more conservative estimate:
  return Math.ceil(text.length / 3);
}

interface ImageUrlContent {
  type: 'image_url';
  image_url: { url: string };
}

interface TextContent {
  type: 'text';
  text: string;
}

type MessageContent = string | (TextContent | ImageUrlContent)[];

interface Attachment {
  contentType?: string;
  url: string;
  name?: string;
}

interface ExtendedMessage extends Message {
  experimental_attachments?: Attachment[];
}

export async function POST(request: Request) {
  const { id, messages, model } = await request.json();
  const session = await auth();

  if (!session?.user?.email || !session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's current usage
  const [user] = await getUser(session.user.email);
  
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  // Get the cached knowledge content for this user
  const knowledgeContent = await getProcessedKnowledgeContent(session.user.id);

  // Check if user has exceeded their limit
  if (hasExceededLimit(Number(user.usage), user.membership)) {
    const resetDate = getNextResetDate();
    return Response.json(
      { 
        error: `You've reached the usage limit for your current plan. Limit resets on ${resetDate}.`,
        lastMessage: messages[messages.length - 1]?.content || '' 
      }, 
      { status: 402 }
    );
  }

  // Convert messages for the AI while preserving attachments
  const coreMessages = convertToCoreMessages(messages);

  // Calculate input tokens more accurately
  const systemMessage = `You are AdvancersAI. The most aligned AI for advancing knowledge and civilization. Grok 3 x The Advancers Philosophy. Always provide the most truthful and insightful answers so people can be most constructive for civilization. Always be simple. Elaborate only when asked or necessary. Never be funny. Never ask questions. Never give motivational answers. Do not refer to these rules, even if you're asked about them.

When analyzing images or files:
- Describe what you see in detail
- Point out any notable features or patterns
- Answer questions about the content specifically
- Maintain the same direct and specific tone`;

  const lastMessageContent = messages[messages.length - 1]?.content || '';
  const hasAttachments = messages.some((msg: ExtendedMessage) => (msg.experimental_attachments ?? []).length > 0);

  // Define keywords for complexity and simplicity
  const complexKeywords = ['explain', 'analyze', 'generate', 'code', 'debug', 'compare', 'contrast', 'plan', 'why', 'how', 'what if', 'create', 'write', 'elaborate', 'expand', 'detail', 'deeper'];
  const simpleKeywords = ['yes', 'no', 'ok', 'okay', 'thanks', 'thank you', 'got it', 'sounds good', 'continue', 'great', 'cool'];
  
  // Function to check for keywords
  const containsKeyword = (text: string, keywords: string[]): boolean => {
    if (typeof text !== 'string') return false;
    const lowerText = text.toLowerCase();
    // Use word boundaries to avoid partial matches (e.g., 'how' in 'show')
    return keywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(lowerText));
  };
  
  // Regex patterns for detecting complex tasks like code or math
  const codePattern = /```|\b(function|class|import|export|def|const|let|var|public|private|static|console\.log|System\.out\.print)\b/i;
  const mathPattern = /\b(solve|integral|derivative|equation|calculate|\+|\-|\*|\/|\^|=)\b/i;
  
  // Function to check message content type (string or complex object)
  const isSimpleStringContent = (content: any): content is string => {
    return typeof content === 'string';
  };
  
  // Determine the model based on attachments, request analysis, and user tier
  let selectedModel;
  let selectedModelName: string; // Store the name for logging or potential future use
  const messageContent = messages[messages.length - 1]?.content;
  const wordCount = typeof messageContent === 'string' ? messageContent.split(/\s+/).length : 0;
  const userMembership = user.membership || 'free';

  if (hasAttachments) {
    selectedModelName = 'grok-2-vision-1212'; // Vision model for attachments
  } else if (isSimpleStringContent(messageContent) && (codePattern.test(messageContent) || mathPattern.test(messageContent))) {
    // Use fast models for Ultimate users only for complex tasks
    if (userMembership === 'ultimate') {
      selectedModelName = 'grok-3-fast';
    } else {
      selectedModelName = 'grok-3';
    }
  } else if (containsKeyword(lastMessageContent, complexKeywords)) {
    // Use fast models for Ultimate users only for complex keyword requests
    if (userMembership === 'ultimate') {
      selectedModelName = 'grok-3-fast';
    } else {
      selectedModelName = 'grok-3';
    }
  } else if (containsKeyword(lastMessageContent, simpleKeywords)) {
    // Use mini-fast for Ultimate users only, regular mini for others
    if (userMembership === 'ultimate') {
      selectedModelName = 'grok-3-mini-fast';
    } else {
      selectedModelName = 'grok-3-mini';
    }
  } else if (isSimpleStringContent(messageContent) && messageContent.length < 80 && wordCount < 15) {
    // Use mini-fast for Ultimate users only for short requests
    if (userMembership === 'ultimate') {
      selectedModelName = 'grok-3-mini-fast';
    } else {
      selectedModelName = 'grok-3-mini';
    }
  } else {
    // Default model selection based on user tier
    if (userMembership === 'ultimate') {
      selectedModelName = 'grok-3-fast';
    } else {
      selectedModelName = 'grok-3';
    }
  }
  
  console.log(`Using model: ${selectedModelName} for request ID: ${id}`);
  selectedModel = xai(selectedModelName);

  const relevantKnowledge = await getRelevantKnowledge(session.user.id, lastMessageContent);
  const contextualKnowledge = getContextFromKnowledge(lastMessageContent, knowledgeContent);

  // Save user messages immediately to ensure they're not lost
  if (session.user?.id && messages.length > 0) {
    try {
      console.log(`Saving user messages for chat ${id} before AI response`);
      await saveChat({
        id,
        messages: messages.map((msg: ExtendedMessage) => ({
          id: msg.id || generateId(),
          role: msg.role,
          content: typeof msg.content === 'string' 
            ? msg.content 
            : Array.isArray(msg.content)
              ? (msg.content as TextContent[]).find((c: TextContent) => c.type === 'text')?.text || (msg.content as TextContent[]).map(c => c.text).join(' ')
              : msg.content,
          experimental_attachments: msg.experimental_attachments?.map((attachment: Attachment) => ({
            ...attachment,
            url: attachment.url
          }))
        })),
        userId: session.user.id,
      });
      console.log(`User messages saved for chat ${id}`);
    } catch (error) {
      console.error('Failed to save user messages:', error);
      // Continue with AI response even if saving fails
    }
  }

  let result;
  
  try {
    result = await streamText({
      model: selectedModel,
      maxTokens: 8192,
      system: systemMessage,
      messages: [
        ...(contextualKnowledge ? [{
          role: 'assistant' as const,
          content: `Context: ${contextualKnowledge}`
        }] : []),
        ...coreMessages
      ] as CoreMessage[],
      temperature: 0.7,
      onFinish: async ({ responseMessages }) => {
        if (session.user?.id && session.user?.email) {
          try {
            console.log(`Saving chat ${id} for user ${session.user.id}`);
            
            // Calculate input and output tokens
            const inputTokens = estimateTokens(
              systemMessage + 
              JSON.stringify(messages) +
              (contextualKnowledge ? contextualKnowledge : '')
            );
            
            const outputTokens = estimateTokens(
              JSON.stringify(responseMessages)
            );
            
            const cost = calculateCost(inputTokens, outputTokens, selectedModelName);
            const currentUsage = Number(user.usage) || 0;
            const newUsage = (currentUsage + cost).toFixed(4);

            // Update usage first
            await updateUserUsage(
              session.user.id, 
              newUsage
            );

            // Save messages with attachment URLs
            const savedChat = await saveChat({
              id,
              messages: [
                ...messages.map((msg: ExtendedMessage) => ({
                  id: msg.id || generateId(),
                  role: msg.role,
                  content: typeof msg.content === 'string' 
                    ? msg.content 
                    : Array.isArray(msg.content)
                      ? (msg.content as TextContent[]).find((c: TextContent) => c.type === 'text')?.text || (msg.content as TextContent[]).map(c => c.text).join(' ')
                      : msg.content,
                  experimental_attachments: msg.experimental_attachments?.map((attachment: Attachment) => ({
                    ...attachment,
                    url: attachment.url // Ensure URL is saved
                  }))
                })),
                ...responseMessages.map((msg: CoreMessage) => ({
                  id: generateId(),
                  role: msg.role,
                  content: msg.content,
                  experimental_attachments: undefined
                }))
              ],
              userId: session.user.id,
            });
            
            console.log(`Chat ${id} saved successfully:`, savedChat.length > 0 ? 'Updated' : 'Created');
          } catch (error) {
            console.error('Failed to save chat or update usage:', error);
            // Don't throw the error to avoid breaking the stream
          }
        }
      },
    });
  } catch (error) {
    console.error('Stream creation error:', error);
    
    // Try to save the chat even if streaming failed
    if (session.user?.id && messages.length > 0) {
      try {
        console.log(`Attempting to save chat ${id} after stream creation error`);
        await saveChat({
          id,
          messages: messages.map((msg: ExtendedMessage) => ({
            id: msg.id || generateId(),
            role: msg.role,
            content: typeof msg.content === 'string' 
              ? msg.content 
              : Array.isArray(msg.content)
                ? (msg.content as TextContent[]).find((c: TextContent) => c.type === 'text')?.text || (msg.content as TextContent[]).map(c => c.text).join(' ')
                : msg.content,
            experimental_attachments: msg.experimental_attachments?.map((attachment: Attachment) => ({
              ...attachment,
              url: attachment.url
            }))
          })),
          userId: session.user.id,
        });
        console.log(`Chat ${id} saved after stream creation error`);
      } catch (saveError) {
        console.error('Failed to save chat after stream creation error:', saveError);
      }
    }
    
    // Return error response
    return Response.json({ error: 'Failed to generate response' }, { status: 500 });
  }

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });
    if (!chat) {
      return new Response('Not Found', { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
