import { applySnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { UserInvite, UserInviteModel } from './user-models'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './user-actions'
import { reset } from 'store'

export const UserStoreModel = types
  .model('UserStore')
  .props({
    // authToken: types.optional(types.string, 'EOqzXhndpa9XyMcCUAPK'),
    // currentIP: types.optional(types.string, 'http://box-5.arcade.city:3001'),
    // myid: types.optional(types.number, 1),
    alias: types.optional(types.string, ''),
    authToken: types.optional(types.string, ''),
    code: types.optional(types.string, ''),
    contactKey: types.optional(types.string, ''),
    currentIP: types.optional(types.string, ''),
    deviceId: types.maybeNull(types.string), // prev optional
    invite: types.optional(UserInviteModel, {}),
    myid: types.optional(types.number, 0), // ?
    onboardStep: types.optional(types.number, 0),
    publicKey: types.optional(types.string, ''),
    tipAmount: types.optional(types.number, 100),
    isPinChanged: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    attemptRehydrate: async (): Promise<boolean> =>
      await actions.attemptRehydrate(self as UserStore),
    attemptRehydrateFromOldVersion: async (): Promise<boolean> =>
      await actions.attemptRehydrateFromOldVersion(self as UserStore),
    finishInvite: async (): Promise<boolean> => await actions.finishInvite(self as UserStore),
    generateToken: async (pwd: string): Promise<string> =>
      await actions.generateToken(self as UserStore, pwd),
    logout: async (): Promise<void> => await actions.logout(self as UserStore),
    miscAction: async (action: string): Promise<any> =>
      await actions.miscAction(self as UserStore, action),
    registerMyDeviceId: (device_id, myid): Promise<void> =>
      actions.registerMyDeviceId(self as UserStore, device_id, myid),
    reportError: async (label: string, error: any): Promise<any> =>
      await actions.reportError(self as UserStore, label, error),
    requestInvite: async (email) => await actions.requestInvite(self, email),
    resetIP: async (): Promise<any> => await actions.resetIP(),
    restore: async (restoreString: string): Promise<any> =>
      await actions.restore(self as UserStore, restoreString),
    signupWithCode: async (code: string): Promise<ArrayObject> =>
      await actions.signupWithCode(self as UserStore, code),
    signupWithIP: async (ip: string): Promise<string | null> =>
      await actions.signupWithIP(self as UserStore, ip),
    setAuthToken: (authToken: string) => {
      self.authToken = authToken
    },
    setAlias: (alias: string) => {
      self.alias = alias
    },
    setContactKey(ck: string) {
      self.contactKey = ck
    },
    setCurrentIP: (ip: string) => {
      self.currentIP = ip
    },
    setInvite: (invite: UserInvite) => {
      self.invite = invite
    },
    setMyID: (id: number) => {
      self.myid = id
    },
    setOnboardStep(s) {
      self.onboardStep = s
    },
    setDeviceId(deviceId) {
      self.deviceId = deviceId
    },
    setPublicKey(pubkey) {
      self.publicKey = pubkey
    },
    setTipAmount(s: number) {
      self.tipAmount = s
    },
    finishOnboard() {
      self.onboardStep = 0
      self.invite = {
        inviterNickname: '',
        inviterPubkey: '',
        welcomeMessage: '',
        action: '',
      }
    },
    setIsPinChanged(bool: boolean) {
      self.isPinChanged = bool
    },
    reset: () => reset(self),
  }))
  .views((self) => ({
    loggedIn(): boolean {
      return !!(self.currentIP && self.authToken)
    },
  }))

type ArrayObject = { [k: string]: string }
type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType { }
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType { }
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
