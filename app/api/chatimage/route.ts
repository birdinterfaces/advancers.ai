import { StreamingTextResponse, Message as VercelChatMessage } from 'ai';

export async function POST(req: Request) {
  const { messages, attachments } = await req.json();
  
  // Format messages for Grok - keeping only text content
  const formattedMessages = messages.map((message: VercelChatMessage) => {
    if (message.role === 'user' && attachments?.length) {
      // Include image URLs in the text content
      const imageUrls = attachments
        .filter((att: any) => att.contentType?.startsWith('image/'))
        .map((att: any) => att.url)
        .join('\n');
      
      return {
        role: message.role,
        content: `${message.content}\n[Image URLs: ${imageUrls}]`
      };
    }
    return {
      role: message.role,
      content: message.content
    };
  });

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: formattedMessages,
      max_tokens: 72000,
      temperature: 0,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Grok API error: ${JSON.stringify(error)}`);
  }

  const stream = response.body;
  if (!stream) {
    throw new Error('No response stream available');
  }

  return new StreamingTextResponse(stream);
}
