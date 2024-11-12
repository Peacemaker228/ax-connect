import { IParams } from '@/app/api/members/[memberId]/route'

export const validateMemberId = (params: Partial<IParams['params']>): string | null => {
  return params.memberId ?? null
}
