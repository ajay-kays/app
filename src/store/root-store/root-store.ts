import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ChatsStoreModel } from 'store/chats-store'
import { ContactsStoreModel } from 'store/contacts-store'
import { DetailsStoreModel } from 'store/details-store'
import { MsgStoreModel } from 'store/msg-store'
import { RelayStoreModel } from 'store/relay-store'
import { UiStoreModel } from 'store/ui-store'
import { UserStoreModel } from 'store/user-store'

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  chats: types.optional(ChatsStoreModel, {} as any),
  contacts: types.optional(ContactsStoreModel, {} as any),
  details: types.optional(DetailsStoreModel, {} as any),
  msg: types.optional(MsgStoreModel, {} as any),
  relay: types.optional(RelayStoreModel, {} as any),
  ui: types.optional(UiStoreModel, {} as any),
  user: types.optional(UserStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
