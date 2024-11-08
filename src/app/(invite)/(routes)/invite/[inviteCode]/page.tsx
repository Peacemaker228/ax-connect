import { FC } from 'react'
import { currentsProfile } from '@/lib/currents-profile'
import { redirect } from 'next/navigation'
import { ERoutes } from '@/lib/routes'
import { db } from '@/lib/db'

interface IInvitePageProps {
  params: {
    inviteCode: string
  }
}

const InvitePage: FC<IInvitePageProps> = async ({ params }) => {
  const { inviteCode } = await params
  const profile = await currentsProfile()

  if (!profile) {
    // TODO: чекнуть и исправить если что
    return redirect(ERoutes.SIGN_IN)
  }

  if (!inviteCode) {
    redirect(ERoutes.MAIN_PAGE)
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (existingServer) {
    redirect(`${ERoutes}/${existingServer.id}`)
  }

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  })

  if (server) {
    redirect(`${ERoutes}/${server.id}`)
  }

  return null
}

export default InvitePage
