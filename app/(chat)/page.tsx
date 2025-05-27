import { cookies } from 'next/headers';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/custom/chat';
import { DEFAULT_MODEL_NAME, models, canAccessModel } from '@/lib/model';
import { generateUUID } from '@/lib/utils';

export default async function Page() {
  const id = generateUUID();
  const session = await auth();
  
  const userMembership = session?.user?.membership || 'free';

  const cookieStore = await cookies();
  const value = cookieStore.get('model')?.value;
  let selectedModelName = models.find((m) => m.name === value)?.name || DEFAULT_MODEL_NAME;
  
  // Check if user can access the selected model, fallback to default if not
  if (!canAccessModel(selectedModelName, userMembership)) {
    selectedModelName = DEFAULT_MODEL_NAME;
  }

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      selectedModelName={selectedModelName}
      userMembership={userMembership}
    />
  );
}
