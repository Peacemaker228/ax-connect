import React, { FC } from 'react'
import { currentsProfile } from '@/lib/currents-profile'
import { ERoutes } from '@/lib/routes'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getOrCreateConversation } from '@/lib/conversation'
import { ChatHeader } from '@/components/chat'

interface IMemberIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
}

const MemberIdPage: FC<IMemberIdPageProps> = async ({ params }) => {
  const profile = await currentsProfile()

  if (!profile) {
    return redirect(ERoutes.SIGN_IN)
  }

  const { memberId, serverId } = await params

  if (!memberId || !serverId) {
    return redirect(ERoutes.MAIN_PAGE)
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) {
    return redirect(ERoutes.MAIN_PAGE)
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId)

  if (!conversation) {
    return redirect(`${ERoutes.SERVERS}/${serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type={'conversation'}
      />
    </div>
  )
}

export default MemberIdPage
