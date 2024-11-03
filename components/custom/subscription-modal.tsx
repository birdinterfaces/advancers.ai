'use client';

import { type User } from 'next-auth';

import { useModal } from '../context/modal-context';
import { Modal } from '../ui/Modal';

import { SidebarUserNavContent } from './sidebar-user-nav';

export function SubscriptionModal({ user }: { user: User }) {
  const { isModalOpen, closeModal } = useModal();

  return (
    <Modal 
      isOpen={isModalOpen} 
      onClose={closeModal} 
      className="border-none shadow-none" 
      title=""
    >
      <SidebarUserNavContent user={user} />
    </Modal>
  );
}
