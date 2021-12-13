import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import { display } from 'lib/logging'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './chats-actions'
import { Chat, ChatModel, Community, CommunityModel } from './chats-models'
import { Destination } from 'store/feed'
import { reset } from 'store'

export const ChatsStoreModel = types
  .model('ChatsStore')
  .props({
    chats: types.optional(types.map(ChatModel), {}),
    communities: types.optional(types.map(CommunityModel), {}),
    // communities: types.optional(types.frozen(), {}),
    pricesPerMinute: types.frozen(),
    servers: types.frozen([{ host: DEFAULT_TRIBE_SERVER }]),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    addGroupMembers: async (chatID: number, contact_ids: number[]): Promise<void> =>
      await actions.addGroupMembers(chatID, contact_ids),
    checkRoute: async (cid: string, myid: number): Promise<any> =>
      await actions.checkRoute(self as ChatsStore, cid, myid),
    createGroup: async (contact_ids: number[], name: string): Promise<any> =>
      await actions.createGroup(self as ChatsStore, contact_ids, name),
    createTribe: async (params: actions.CreateTribeParams): Promise<any> =>
      await actions.createTribe(self as ChatsStore, params),
    editTribe: async (params: actions.EditCommunityParams): Promise<any> =>
      await actions.editTribe(self as ChatsStore, params),
    exitGroup: async (chatID: number): Promise<void> =>
      await actions.exitGroup(self as ChatsStore, chatID),
    getChats: async (): Promise<boolean> => await actions.getChats(self as ChatsStore),
    getCommunities: async (): Promise<boolean> => await actions.getCommunities(self as ChatsStore),
    getDefaultTribeServer: (): any => actions.getDefaultTribeServer(self as ChatsStore),
    getTribeDetails: async (host: string, uuid: string): Promise<any> =>
      await actions.getTribeDetails(self as ChatsStore, host, uuid),
    gotChat: async (chat: Chat): Promise<any> => await actions.gotChat(self as ChatsStore, chat),
    joinDefaultTribe: async (): Promise<boolean> =>
      await actions.joinDefaultTribe(self as ChatsStore),
    joinTribe: async (params: actions.JoinTribeParams): Promise<boolean> =>
      await actions.joinTribe(self as ChatsStore, params),
    kick: async (chatID: number, contactID: number): Promise<void> =>
      await actions.kick(self as ChatsStore, chatID, contactID),
    loadFeed: async (host: string, uuid: string, url: string): Promise<any> =>
      await actions.loadFeed(host, uuid, url),
    loadFeedById: async (id: string): Promise<any> =>
      await actions.loadFeedById(self as ChatsStore, id),
    removeChat(id) {
      self.chats.delete(id)
    },
    muteChat: async (chatID: number, muted: boolean): Promise<void> =>
      await actions.muteChat(self as ChatsStore, chatID, muted),
    sendPayments: async (
      destinations: Destination[],
      text: string,
      amount: number,
      chat_id: number,
      update_meta: boolean
    ): Promise<any> =>
      await actions.sendPayments(
        self as ChatsStore,
        destinations,
        text,
        amount,
        chat_id,
        update_meta
      ),
    updateMyInfoInChat: async (
      tribeID: number,
      my_alias: string,
      my_photo_url: string
    ): Promise<void> =>
      await actions.updateMyInfoInChat(self as ChatsStore, tribeID, my_alias, my_photo_url),
    updateTribeAsNonAdmin: async (tribeID: number, name: string, img: string): Promise<void> =>
      await actions.updateTribeAsNonAdmin(self as ChatsStore, tribeID, name, img),
    parseChat: (c): Chat => {
      if (c.meta && typeof c.meta === 'string') {
        let meta
        try {
          meta = JSON.parse(String(c.meta))
        } catch (e) {}
        return { ...c, meta }
      }
      return c
    },
    setChat: (chat: Chat) => {
      self.chats.set(chat.id.toString(), chat)
    },
    // setChats: (chats: Chat[]) => {
    //   chats.forEach((chat) => (self as ChatsStore).setChat(chat))
    // },

    setCommunities(communities: Community[]) {
      const formattedArray: any = []
      communities.forEach((community) => {
        formattedArray.push([community.uuid, community])
      })
      self.communities.merge(formattedArray)
      display({
        name: 'setCommunities',
        preview: `Set ${communities.length} communities`,
        value: { communities, formattedArray },
      })
    },

    // setCommunities: (communities: any) => (self.communities = communities),
    updateChatMeta: (chat_id: number, meta: any) => {
      const chat = self.chats?.get(chat_id.toString())
      if (chat) {
        chat.setMeta(meta)
      }
    },
    updateServers: (): void => {
      // skipping for now
      // self.servers = [{ host: DEFAULT_TRIBE_SERVER }]
    },

    setChats(chats: Chat[]) {
      const formattedArray: any = []
      chats.forEach((chat) => {
        formattedArray.push([chat.id, chat])
      })
      self.chats.merge(formattedArray)
      display({
        name: 'setChats',
        preview: `Set ${chats.length} chats`,
        value: { chats, formattedArray },
      })
    },
  }))
  .views((self) => ({
    get chatsArray(): Chat[] {
      return Array.from(self.chats.values())
    },
    get communitiesArray(): Community[] {
      return Array.from(self.communities.values())
    },
    get communitiesArrayWithJoined(): Community[] {
      const comms = Array.from(self.communities.values())
      const commsToReturn: Community[] = []
      comms.forEach((comm) => {
        const grab = self.communities.get(comm.uuid)
        if (!grab) return

        commsToReturn.push({
          ...grab,
          joined: grab.joined,
          owner: grab.owner,
        })
      })

      return commsToReturn
    },
    setPricePerMinute(chatId: number, ppm: number) {
      if (!chatId) return
      try {
        const chat = self.chats.get(chatId.toString())
        if (chat) {
          chat.setPricePerMinute(ppm)
        } else {
          display({
            name: 'setPricePerMinute',
            preview: `Couldn't set price per minute for chat ${chatId}`,
          })
          return 0
        }
      } catch (e) {
        display({
          name: 'setPricePerMinute',
          preview: `Error setting price per minute for chat ${chatId}`,
        })
      }
    },
    getPricePerMinute(chatId: number) {
      try {
        const chat = self.chats.get(chatId.toString())
        if (chat) {
          return chat.pricePerMinute
        } else {
          display({
            name: 'getPricePerMinute',
            preview: `Couldn't get price per minute for chat ${chatId}`,
          })
          return 0
        }
      } catch (e) {
        display({
          name: 'getPricePerMinute',
          preview: `Error getting price per minute for chat ${chatId}`,
        })
      }
    },
    reset: () => reset(self),
  }))

type ChatsStoreType = Instance<typeof ChatsStoreModel>
export interface ChatsStore extends ChatsStoreType {}
type ChatsStoreSnapshotType = SnapshotOut<typeof ChatsStoreModel>
export interface ChatsStoreSnapshot extends ChatsStoreSnapshotType {}
export const createChatsStoreDefaultModel = () => types.optional(ChatsStoreModel, {})
