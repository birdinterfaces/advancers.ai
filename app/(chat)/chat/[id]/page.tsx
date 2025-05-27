import { CoreMessage } from 'ai';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat as PreviewChat } from '@/components/custom/chat';
import { getChatById } from '@/db/queries';
import { Chat } from '@/db/schema';
import { DEFAULT_MODEL_NAME, models, canAccessModel } from '@/lib/model';
import { convertToUIMessages } from '@/lib/utils';

export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting
  const chat: Chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  if (session.user.id !== chat.userId) {
    return notFound();
  }

  const userMembership = session.user.membership || 'free';

  const cookieStore = await cookies();
  const value = cookieStore.get('model')?.value;
  let selectedModelName = models.find((m) => m.name === value)?.name || DEFAULT_MODEL_NAME;
  
  // Check if user can access the selected model, fallback to default if not
  if (!canAccessModel(selectedModelName, userMembership)) {
    selectedModelName = DEFAULT_MODEL_NAME;
  }

  return (
    <PreviewChat
      id={chat.id}
      initialMessages={chat.messages}
      selectedModelName={selectedModelName}
      userMembership={userMembership}
    />
  );
}
