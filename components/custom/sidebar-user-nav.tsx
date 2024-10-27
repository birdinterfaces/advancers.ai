'use client';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { type User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Modal } from '@/components/ui/Modal';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function SidebarUserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
                <Image
                  src={`https://avatar.vercel.sh/${user.email}`}
                  alt={user.email ?? 'User Avatar'}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{user?.email}</span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem asChild>
                <button
                  className="w-full text-left"
                  onClick={openModal}
                >
                  Your Plan
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button
                  className="w-full text-left"
                  onClick={() => {
                    signOut({
                      redirect: true,
                      callbackUrl: '/',
                    });
                  }}
                >
                  Sign out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Plans">
        <div className="flex flex-col space-y-4">
          <div className="border rounded-lg p-4 flex-1">
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="text-gray-600 dark:text-gray-300">Basic features for personal use.</p>
            {/* Add more details or buttons as needed */}
          </div>
          <div className="border rounded-lg p-4 flex-1">
            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="text-gray-600 dark:text-gray-300">Advanced features for professionals.</p>
            {/* Add more details or buttons as needed */}
          </div>
        </div>
      </Modal>
    </>
  );
}
