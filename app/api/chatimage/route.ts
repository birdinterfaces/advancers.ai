import { StreamingTextResponse, Message as VercelChatMessage } from 'ai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

export async function POST(req: Request) {
  const { messages, attachments } = await req.json();
  
  // Process any image attachments
  const imageAttachments = attachments?.filter(
    (att: any) => att.contentType?.startsWith('image/')
  ) || [];
  
  // Convert messages and include image URLs in the content
  const formattedMessages = messages.map((message: VercelChatMessage) => {
    if (message.role === 'user' && imageAttachments.length > 0) {
      // Include image URLs in the message content
      const imageUrls = imageAttachments.map((att: any) => att.url).join('\n');
      return new HumanMessage({
        content: [
          { type: 'text', text: message.content },
          ...imageAttachments.map((att: any) => ({
            type: 'image_url',
            image_url: att.url
          }))
        ]
      });
    }
    // ... rest of message formatting
  });

  // ... rest of chat processing logic
}
