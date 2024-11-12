import { NextResponse } from 'next/server'
import { currentsProfile } from '@/lib/currents-profile'
import { db } from '@/lib/db'

export const PATCH = async (req: Request, { params }: { params: { serverId: string } }) => {
  try {
    const profile = await currentsProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log(profile, 'profile')

    const { serverId } = await params

    if (!serverId) {
      return new NextResponse('Server ID Missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (err) {
    console.log('[Server_ID_LEAVE]', err)

    return new NextResponse('Internal Error', { status: 500 })
  }
}
