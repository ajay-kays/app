import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment, withRootStore } from '../extensions'
import * as actions from './relay-actions'

export const RelayStoreModel = types
  .model('RelayStore')
  .props({
    /** Access or invite code */
    code: types.optional(types.string, ''),
    /** Are we connected to a relay? */
    connected: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .actions((self) => ({
    checkInvite: async (code: string): Promise<void> =>
      await actions.checkInvite(self as RelayStore, code),
    connect: async (): Promise<boolean> => await actions.connect(self as RelayStore),
    pinEntered: async (pin: string): Promise<boolean> =>
      await actions.pinEntered(self as RelayStore, pin),
    registerWebsocketHandlers: async (): Promise<boolean> =>
      await actions.registerWebsocketHandlers(self as RelayStore),
    setCode(code: string) {
      self.code = code
    },
    setConnected(connected: boolean) {
      self.connected = connected
    },
  }))
  .views((self) => ({
    placeholder: () => {},
  }))

type RelayStoreType = Instance<typeof RelayStoreModel>
export interface RelayStore extends RelayStoreType {}
type RelayStoreSnapshotType = SnapshotOut<typeof RelayStoreModel>
export interface RelayStoreSnapshot extends RelayStoreSnapshotType {}
export const createRelayStoreDefaultModel = () => types.optional(RelayStoreModel, {})
