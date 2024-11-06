import { FC } from 'react'
import { currentsProfile } from '@/lib/currents-profile'
import { redirect } from 'next/navigation'
import { ERoutes } from '@/lib/routes'
import { db } from '@/lib/db'
import { ChannelType } from '@prisma/client'
import { ServerHeader } from '@/components/server/server-header'

interface IServerSidebarProps {
  serverId: string
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

  const members = server.members.filter(({ profileId }) => profileId !== profile.id)

  const role = server.members.find(({ profileId }) => profileId === profile.id)?.role

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  )
}
