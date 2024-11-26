import { StreamingTextResponse, Message as VercelChatMessage } from 'ai';

export async function POST(req: Request) {
  const { messages, attachments } = await req.json();
  
  // Process any image attachments
  const imageAttachments = attachments?.filter(
    (att: any) => att.contentType?.startsWith('image/')
  ) || [];
  
  // Format messages for Grok
  const formattedMessages = messages.map((message: VercelChatMessage) => {
    if (message.role === 'user' && imageAttachments.length > 0) {
      return {
        role: 'user',
        content: [
          { type: 'text', text: message.content },
          ...imageAttachments.map((att: any) => ({
            type: 'image_url',
            image_url: { url: att.url }
          }))
        ]
      };
    }
    return message;
  });

  // Make API request to Grok
  const response = await fetch('https://api.grok.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: formattedMessages,
      stream: true,
    }),
  });

  // Handle error if response isn't ok
  if (!response.ok) {
    throw new Error(`Grok API error: ${response.statusText}`);
  }

  // Ensure stream exists before creating StreamingTextResponse
  const stream = response.body;
  if (!stream) {
    throw new Error('No response stream available');
  }

  return new StreamingTextResponse(stream);
}
