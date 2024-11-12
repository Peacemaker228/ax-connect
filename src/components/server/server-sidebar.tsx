import { FC } from 'react'
import { currentsProfile } from '@/lib/currents-profile'
import { redirect } from 'next/navigation'
import { ERoutes } from '@/lib/routes'
import { db } from '@/lib/db'
import { ServerHeader } from '@/components/server/server-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IServerData, ServerSearch } from '@/components/server/server-search'
import { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

interface IServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
}

export const ServerSidebar: FC<IServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentsProfile()

  if (!profile) {
    redirect(ERoutes.MAIN_PAGE)
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  if (!server) {
    redirect(ERoutes.MAIN_PAGE)
  }

  const textChannels = server.channels.filter(({ type }) => type === ChannelType.TEXT)
  const audioChannels = server.channels.filter(({ type }) => type === ChannelType.AUDIO)
  const videoChannels = server.channels.filter(({ type }) => type === ChannelType.VIDEO)
  //
  const members = server.members.filter(({ profileId }) => profileId !== profile.id)

  const role = server.members.find(({ profileId }) => profileId === profile.id)?.role

  const searchData: IServerData[] = [
    {
      label: 'Text Channels',
      type: 'channel',
      data: textChannels.map(({ id, name }) => ({ id, name, icon: iconMap[ChannelType.TEXT] })),
    },
    {
      label: 'Voice Channels',
      type: 'channel',
      data: audioChannels.map(({ id, name }) => ({ id, name, icon: iconMap[ChannelType.AUDIO] })),
    },
    {
      label: 'Video Channels',
      type: 'channel',
      data: videoChannels.map(({ id, name }) => ({ id, name, icon: iconMap[ChannelType.VIDEO] })),
    },
    {
      label: 'Members',
      type: 'member',
      data: members.map(({ id, profile, role }) => ({ id, name: profile?.name, icon: roleIconMap[role] })),
    },
  ]

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={searchData} />
        </div>
      </ScrollArea>
    </div>
  )
}
