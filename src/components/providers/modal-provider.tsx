'use client'

import {
  CreateChannelModal,
  CreateServerModal,
  DeleteServerModal,
  EditServerModal,
  InviteModal,
  LeaveServerModal,
  MembersModal,
} from '@/components/modals'

export const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  )
}
