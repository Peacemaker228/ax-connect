import { IMemberParams } from '@/app/api/members/[memberId]/route'

export const validateMemberId = (params: Partial<IMemberParams['params']>): string | null => {
  return params.memberId ?? null
}
