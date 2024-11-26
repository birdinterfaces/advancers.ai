import { StreamingTextResponse, Message as VercelChatMessage } from 'ai';

export async function POST(req: Request) {
  const { messages, attachments } = await req.json();
  
  // Simplify messages to bare minimum format
  const formattedMessages = messages.map((message: VercelChatMessage) => ({
    role: message.role,
    text: message.content // Using 'text' instead of 'content' as per error message
  }));

  // Create minimal request body
  const requestBody = {
    model: 'grok-beta',
    messages: formattedMessages,
    stream: true
  };

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Grok API Error:', error);
    throw new Error(`Grok API error: ${JSON.stringify(error)}`);
  }

  const stream = response.body;
  if (!stream) {
    throw new Error('No response stream available');
  }

  return new StreamingTextResponse(stream);
}
