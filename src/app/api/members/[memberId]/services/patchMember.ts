import { NextResponse } from 'next/server'
import { currentsProfile } from '@/lib/currents-profile'
import { db } from '@/lib/db'
import { validateMemberId } from './utils'
import { getServerId } from '@/app/api/utils'

export const patchMember = async (req: Request, params: { memberId: string }) => {
  try {
    const profile = await currentsProfile()
    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    const serverId = getServerId(req.url)
    if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })

    const { role } = await req.json()
    const memberId = validateMemberId(params)
    if (!memberId) return new NextResponse('Member ID Missing', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: { role },
          },
        },
      },
      include: {
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

    return NextResponse.json(server)
  } catch (err) {
    console.error('[MEMBER_ID_PATCH]', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
