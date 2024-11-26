import { StreamingTextResponse, Message as VercelChatMessage } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Convert messages to Grok's expected format
  const grokMessages = messages.map((message: VercelChatMessage) => ({
    text: message.content,
    role: message.role === 'assistant' ? 'assistant' : 'user'
  }));

  try {
    // Create a minimal request that matches Grok's expectations
    const grokRequest = {
      messages: grokMessages,
      stream: true
    };

    console.log('Sending request to Grok:', JSON.stringify(grokRequest, null, 2));

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify(grokRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Grok API Error:', errorData);
      throw new Error(`Grok API error: ${JSON.stringify(errorData)}`);
    }

    // Ensure we have a stream
    const stream = response.body;
    if (!stream) {
      throw new Error('No response stream available');
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
