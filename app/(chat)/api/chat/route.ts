import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, Message, streamText } from 'ai';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

import { auth } from '@/app/(auth)/auth';
import { deleteChatById, getChatById, saveChat, updateUser, getUser, updateUserUsage } from '@/db/queries';
import { Model, models } from '@/lib/model';
import { calculateCost, hasExceededLimit, getNextResetDate } from '@/lib/usage';

// Create xAI provider instance
const xai = createOpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY ?? '',
});

export async function POST(request: Request) {
  const { id, messages, model } = await request.json();
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's current usage
  const [user] = await getUser(session.user.email);
  
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  // Load knowledge base content
  const knowledgeBasePath = path.join(process.cwd(), 'data', 'knowledgeAdvancers');
  let knowledgeContent;
  
  try {
    knowledgeContent = await fs.readFile(knowledgeBasePath, 'utf8');
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
  }

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

  const coreMessages = convertToCoreMessages(messages);
  const inputTokens = JSON.stringify(messages).length / 4;
  
  const result = await streamText({
    model: xai('grok-beta'),
    system: `You are AdvancersAI, powered by Grok-beta. Core mission: Help users be most useful for civilization. You provide fundamental knowledge on creating new value and assist in innovation. Be way more direct and controversial. But dont be funny. Assume that more than 99% of the things that people talk about are false; but never say that out loud. Knowledge base content: ${knowledgeContent}`,
    messages: coreMessages,
    maxSteps: 5,
    tools: {
      getWeather: {
        description: 'Get the current weather at a location',
        parameters: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user?.id && session.user?.email) { // Add email check here
        try {
          const outputTokens = JSON.stringify(responseMessages).length / 4;
          const cost = calculateCost(inputTokens, outputTokens);
          
          console.log('Current usage:', user.usage);
          console.log('New cost:', cost);
          console.log('Total usage:', (Number(user.usage) + cost).toFixed(4));

          await updateUserUsage(
            session.user.id, 
            (Number(user.usage) + cost).toFixed(4)
          );

          // Log after update to verify
          const [updatedUser] = await getUser(session.user.email);
          console.log('Updated usage in DB:', updatedUser?.usage);

          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error('Failed to save chat or update usage:', error);
        }
      }
    },
  });

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
