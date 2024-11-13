'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { Check, GavelIcon, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { TServerMembersProfiles } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { MemberRole } from '@prisma/client'
import { ReactNode, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import qs from 'query-string'
import { useRouter } from 'next/navigation'

const roleIconMap: Record<MemberRole, ReactNode | null> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
}

export const MembersModal = () => {
  const [loadingId, setLoadingId] = useState('')
  const { isOpen, onClose, type, data, onOpen } = useModal()
  const router = useRouter()

  const { server } = data as { server: TServerMembersProfiles }

  const isModalOpen = isOpen && type === 'members'

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })

      const res = await axios.delete(url)

      router.refresh()

      onOpen('members', { server: res.data })

      setLoadingId('')
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingId('')
    }
  }

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })

      const res = await axios.patch(url, { role })

      router.refresh()

      onOpen('members', { server: res.data })

      setLoadingId('')
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">Управление участниками</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Участников: {server?.members?.length}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((m) => (
            <div key={m.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={m.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {m.profile.name}
                  {roleIconMap[m.role]}
                </div>
                <p className="text-xs text-zinc-500">{m.profile.email}</p>
              </div>
              {server.profileId !== m.profileId && loadingId !== m.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side={'left'}>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => {
                                return handleRoleChange(m.id, MemberRole.GUEST)
                              }}>
                              <Shield className="h-4 w-4 mr-2" />
                              Guest
                              {m.role === MemberRole.GUEST && <Check className="w-4 h-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                return handleRoleChange(m.id, MemberRole.MODERATOR)
                              }}>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Moderator
                              {m.role === MemberRole.MODERATOR && <Check className="w-4 h-4 ml-auto" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          return handleKick(m.id)
                        }}>
                        <GavelIcon className="h-4 w-4 mr-2" /> Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === m.id && <Loader2 className="animate-spin h-4 w-4 text-zinc-500 ml-auto" />}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
