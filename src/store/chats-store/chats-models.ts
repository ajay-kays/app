import { constants } from 'lib/constants'
import { getRoot, Instance, types } from 'mobx-state-tree'
import { RootStore } from 'store'
import { InviteModel } from '../contacts-store/contacts-models'

export const ChatModel = types
  .model('Chat')
  .props({
    id: types.identifierNumber,
    uuid: types.string,
    name: types.string,
    photo_url: types.string,
    type: types.number,
    status: types.number,
    contact_ids: types.array(types.number), // should be references
    is_muted: types.boolean,
    created_at: types.string,
    updated_at: types.string,
    deleted: types.boolean,
    feed_url: types.string,
    app_url: types.string,
    group_key: types.string,
    host: types.string,
    price_to_join: types.number,
    price_per_message: types.number,
    escrow_amount: types.number,
    escrow_millis: types.number,
    owner_pubkey: types.string,
    unlisted: types.boolean,
    private: types.boolean,
    pending_contact_ids: types.array(types.number),
    invite: types.maybeNull(InviteModel),
    pricePerMinute: types.number,
    meta: types.frozen(),
    my_alias: types.string,
    my_photo_url: types.string,
  })
  .actions((self) => ({
    setPricePerMinute: (ppm: number) => {
      self.pricePerMinute = ppm
    },
    setMeta: (meta: any) => {
      self.meta = meta
    },
    setMuted: (muted: boolean) => {
      self.is_muted = muted
    },
    updateMyInfo: (my_alias: string, my_photo_url: string) => {
      self.my_alias = my_alias
      self.my_photo_url = my_photo_url
    },
    updateTribeAliasAndImg: (name: string, photo_url: string) => {
      self.name = name
      self.photo_url = photo_url
    },
  }))

export const CommunityModel = types
  .model('Community')
  .props({
    uuid: types.identifier,
    app_url: types.string,
    bots: types.frozen(),
    created: types.string,
    deleted: types.boolean,
    description: types.string,
    escrow_amount: types.number,
    escrow_millis: types.number,
    feed_url: types.string,
    group_key: types.string,
    img: types.string,
    last_active: types.number,
    member_count: types.number,
    name: types.string,
    owner_alias: types.string,
    owner_pubkey: types.string,
    owner_route_hint: types.string,
    price_per_message: types.number,
    price_to_join: types.number,
    private: types.boolean,
    tags: types.array(types.string),
    unlisted: types.boolean,
    updated: types.string,
  })
  .views((self) => ({
    get chat(): Chat | undefined {
      const root = getRoot(self) as RootStore
      const chat = root.chats.chatsArray.find((c) => c.uuid === self.uuid)
      return chat
    },
    get joined(): boolean {
      const root = getRoot(self) as RootStore
      const chatsuids = root.chats.chatsArray.map((c) => c.uuid)
      const joined = chatsuids
        ? chatsuids.find((uuid) => uuid === self.uuid)
          ? true
          : false
        : false
      return joined
    },
    get owner(): boolean {
      const root = getRoot(self) as RootStore
      const ownedChats = root.chats.chatsArray.filter(
        (c) => c.type === constants.chat_types.tribe && c.owner_pubkey === root.user.publicKey
      )
      const owner = ownedChats
        ? ownedChats.find((c) => c.uuid === self.uuid)
          ? true
          : false
        : false
      return owner
    },
  }))

export interface Chat extends Instance<typeof ChatModel> {}
export interface Community extends Instance<typeof CommunityModel> {}
