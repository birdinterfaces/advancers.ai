import { StreamingTextResponse, Message as VercelChatMessage } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages, attachments } = await req.json();
    
    // Process any image attachments
    const imageAttachments = attachments?.filter(
      (att: any) => att.contentType?.startsWith('image/')
    ) || [];

    // Format messages for Grok, including image URLs in the system message
    const formattedMessages = messages.map((message: VercelChatMessage) => {
      if (message.role === 'user' && imageAttachments.length > 0) {
        return {
          role: 'user',
          content: `${message.content}\n[Attached images: ${imageAttachments.map((att: { url: string }) => att.url).join(', ')}]`
        };
      }
      return message;
    });

    // Use the existing xAI instance from your code
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: formattedMessages,
        stream: true,
        max_tokens: 72000,
        temperature: 0
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const stream = response.body;
    if (!stream) {
      throw new Error('No response stream available');
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
