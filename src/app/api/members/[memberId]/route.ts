import { deleteMember } from './services/deleteMember'
import { patchMember } from './services/patchMember'

export interface IParams {
  params: {
    memberId: string
  }
}

export const DELETE = (req: Request, context: IParams) => deleteMember(req, context.params)
export const PATCH = (req: Request, context: IParams) => patchMember(req, context.params)
