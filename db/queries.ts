"server-only";


import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";


import { user, chat, User } from "./schema";


// Create and export the database instance
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
export const db = drizzle(client);


export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}


export async function createUser(email: string, password: string | null, name: string) {
  try {
    const passwordHash = password ? hashSync(password, genSaltSync(10)) : null;


    return await db.insert(user).values({ 
      email, 
      password: passwordHash, 
      name,
      membership: 'free',
      usage: '0.0000',
      stripecustomerid: null,
      stripesubscriptionid: null,
      previoussubscriptionid: null,
      provider: 'google',
    });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}


export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const users = await db.select().from(user).where(eq(user.id, userId));
    if (users.length === 0) {
      throw new Error("User not found");
    }


    // Ensure experimental_attachments are properly serialized
    const processedMessages = messages.map((msg: any) => {
      // If the message is already stringified, parse it first
      const message = typeof msg === 'string' ? JSON.parse(msg) : msg;
      return {
        ...message,
        experimental_attachments: Array.isArray(message.experimental_attachments) 
          ? message.experimental_attachments 
          : undefined
      };
    });


    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));


    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: processedMessages,
          updatedAt: new Date(),
        })
        .where(eq(chat.id, id))
        .returning();
    }


    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: processedMessages,
      userId,
    }).returning();
  } catch (error) {
    console.error("Failed to save chat in database:", error);
    throw error;
  }
}


export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}


export async function getChatsByUserId({ id }: { id: string }) {
  try {
    const chats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.updatedAt));
      
    // Parse messages and ensure experimental_attachments are properly handled
    return chats.map(chat => {
      try {
        // Handle both string and object message formats
        const messages = Array.isArray(chat.messages) 
          ? chat.messages 
          : JSON.parse(chat.messages as string);

        return {
          ...chat,
          messages: messages.map((msg: any) => {
            // If the message is a string, parse it
            const message = typeof msg === 'string' ? JSON.parse(msg) : msg;
            return {
              ...message,
              experimental_attachments: message.experimental_attachments || undefined
            };
          })
        };
      } catch (e) {
        console.error('Error parsing messages for chat:', chat.id, e);
        return {
          ...chat,
          messages: []
        };
      }
    });
  } catch (error) {
    console.error("Failed to get chats by user from database:", error);
    return [];
  }
}


export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    if (!selectedChat) return null;

    try {
      // Handle both string and object message formats
      const messages = Array.isArray(selectedChat.messages) 
        ? selectedChat.messages 
        : JSON.parse(selectedChat.messages as string);

      return {
        ...selectedChat,
        messages: messages.map((msg: any) => {
          // If the message is a string, parse it
          const message = typeof msg === 'string' ? JSON.parse(msg) : msg;
          return {
            ...message,
            experimental_attachments: message.experimental_attachments || undefined
          };
        })
      };
    } catch (e) {
      console.error('Error parsing messages for chat:', id, e);
      return {
        ...selectedChat,
        messages: []
      };
    }
  } catch (error) {
    console.error("Failed to get chat by id from database:", error);
    throw error;
  }
}


type UpdateUserData = Partial<Pick<User, 'stripecustomerid' | 'stripesubscriptionid' | 'membership' | 'usage'>>;


export async function updateUser(userId: string, data: UpdateUserData) {
  try {
    const [updatedUser] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, userId))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user in database");
    throw error;
  }
}


export async function updateUserBystripecustomerid(
  stripecustomerid: string,
  data: Partial<Pick<User, "stripesubscriptionid" | "membership">>
) {
  try {
    const [updatedUser] = await db
      .update(user)
      .set(data)
      .where(eq(user.stripecustomerid, stripecustomerid))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user by Stripe customer ID in database");
    throw error;
  }
}


export async function updateUserUsage(userId: string, newUsage: string) {
  try {
    return await db
      .update(user)
      .set({ usage: newUsage })
      .where(eq(user.id, userId));
  } catch (error) {
    console.error("Failed to update user usage in database");
    throw error;
  }
}


export async function updateUserData(userId: string, data: Partial<Pick<User, 'membership' | 'usage' | 'stripecustomerid' | 'stripesubscriptionid' | 'previoussubscriptionid'>>) {
  try {
    return await db
      .update(user)
      .set(data)
      .where(eq(user.id, userId));
  } catch (error) {
    console.error("Failed to update user data in database");
    throw error;
  }
}