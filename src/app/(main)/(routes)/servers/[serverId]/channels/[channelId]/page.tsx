import React, { FC } from 'react'
import { currentsProfile } from '@/lib/currents-profile'
import { ERoutes } from '@/lib/routes'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ChatHeader } from '@/components/chat'

interface IChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage: FC<IChannelIdPageProps> = async ({ params }) => {
  const profile = await currentsProfile()

  if (!profile) {
    return redirect(ERoutes.SIGN_IN)
  }

  const { serverId, channelId } = await params

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) {
    redirect(ERoutes.MAIN_PAGE)
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name={channel.name} serverId={channel.serverId} type={'channel'} />
    </div>
  )
}

export default ChannelIdPage
