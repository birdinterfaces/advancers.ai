import { NextResponse } from 'next/server';


import { db } from '@/db/queries';
import { user } from '@/db/schema';


export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Reset all users' usage to 0
    await db
      .update(user)
      .set({ usage: '0.00' });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset usage:', error);
    return NextResponse.json({ error: 'Failed to reset usage' }, { status: 500 });
  }
} 