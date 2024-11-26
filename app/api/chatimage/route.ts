import { StreamingTextResponse, Message as VercelChatMessage } from 'ai';

export async function POST(req: Request) {
  try {
    // Log the incoming request
    const body = await req.json();
    console.log('Incoming request:', JSON.stringify(body, null, 2));

    const messages = body.messages;

    // Validate messages
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    // Log the messages we received
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Format messages for Grok
    const grokMessages = messages.map((message: VercelChatMessage) => {
      console.log('Processing message:', message);
      return {
        text: message.content,
        role: message.role === 'assistant' ? 'assistant' : 'user'
      };
    });

    // Log the formatted messages
    console.log('Formatted messages for Grok:', JSON.stringify(grokMessages, null, 2));

    // Check if API key exists
    if (!process.env.GROK_API_KEY) {
      throw new Error('GROK_API_KEY is not configured');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        messages: grokMessages,
        stream: true
      })
    });

    // Log the response status
    console.log('Grok API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Grok API Error:', errorData);
      throw new Error(`Grok API error: ${JSON.stringify(errorData)}`);
    }

    const stream = response.body;
    if (!stream) {
      throw new Error('No response stream available');
    }

    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('Detailed error:', error);
    
    // Return a more detailed error response
    return new Response(
      JSON.stringify({
        error: 'Chat processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
