import { Instance, types } from 'mobx-state-tree'

export const ServerModal = types
  .model('Server')
  .props({ host: types.optional(types.string, ''), token: types.optional(types.string, '') })

export interface Server extends Instance<typeof ServerModal> {}
