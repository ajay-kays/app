import { Instance, types } from 'mobx-state-tree'
import { INVITER_KEY } from 'lib/config'

export const UserInviteModel = types.model('UserInvite').props({
  action: types.optional(types.string, ''),
  inviterNickname: types.optional(types.string, 'Zion Root'),
  inviterPubkey: types.optional(types.string, INVITER_KEY),
  welcomeMessage: types.optional(types.string, 'Welcome to Zion!'),
  // inviterNickname: types.optional(types.string, ''),
  // inviterPubkey: types.optional(types.string, ''),
  // welcomeMessage: types.optional(types.string, ''),
})

export interface UserInvite extends Instance<typeof UserInviteModel> {}
