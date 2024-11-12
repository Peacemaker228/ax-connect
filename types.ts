import { Server, Member, Profile } from '@prisma/client'

export type TServerMembersProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export enum EGeneral {
  GENERAL = 'general',
}
