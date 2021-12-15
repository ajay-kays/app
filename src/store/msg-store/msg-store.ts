import { entries, values } from 'mobx'
import { getRoot, Instance, SnapshotOut, types } from 'mobx-state-tree'
import moment from 'moment'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './msg-actions'
import { Msg, MsgModel } from './msg-models'
import {
  PurchaseMediaParams,
  SendAnonPaymentParams,
  SendAttachmentParams,
  SendInvoiceParams,
  SendMessageParams,
  SendPaymentParams,
} from './msg-actions'
import { display } from 'lib/logging'
import { reset, RootStore } from 'store'

export const MsgStoreModel = types
  .model('MsgStore')
  .props({
    lastFetched: types.optional(types.number, 0),
    lastSeen: types.optional(types.frozen(), {}),
    // messages: types.optional(types.map(MsgModel), {}),
    messages: types.map(types.array(MsgModel)),
    // messageCache: types.frozen({}), // types.optional(types.frozen(), [])
  })
  .extend(withEnvironment)
  .actions((self) => ({
    approveOrRejectMember: async (
      contactID: number,
      status: string,
      msgId: number
    ): Promise<void> =>
      await actions.approveOrRejectMember(self as MsgStore, contactID, status, msgId),
    batchDecodeMessages: async (msgs: any): Promise<boolean> =>
      await actions.batchDecodeMessages(self as MsgStore, msgs),
    createRawInvoice: async ({ amt, memo }: { amt: number; memo: string }): Promise<any> =>
      await actions.createRawInvoice(amt, memo),
    deleteMessage: async (id: number): Promise<void> =>
      await actions.deleteMessage(self as MsgStore, id),
    getDirectMessages: async (): Promise<any> => await actions.getDirectMessages(self as MsgStore),
    getMessages: async (forceMore: boolean = false): Promise<any> =>
      await actions.getMessages(self as MsgStore, forceMore),
    getMessages2: async (): Promise<any> => await actions.getMessages2(self as MsgStore),
    getMessagesForChat: async (chatId: number, limit: number = 0): Promise<any> =>
      await actions.getMessagesForChat(self as MsgStore, chatId, limit),
    getRecentMessages: async (): Promise<any> => await actions.getRecentMessages(self as MsgStore),
    gotNewMessage: async (m: any): Promise<any> => await actions.gotNewMessage(self as MsgStore, m),
    gotNewMessageFromWS: async (m: any): Promise<any> =>
      await actions.gotNewMessageFromWS(self as MsgStore, m),
    initLastSeen: async (): Promise<any> => await actions.initLastSeen(self as MsgStore),
    invoicePaid: async (m: any): Promise<any> => await actions.invoicePaid(self as MsgStore, m),
    payInvoice: async ({
      payment_request,
      amount,
    }: {
      payment_request: string
      amount: number
    }): Promise<void> => await actions.payInvoice(self as MsgStore, payment_request, amount),
    purchaseMedia: async ({
      contact_id,
      amount,
      chat_id,
      media_token,
    }: PurchaseMediaParams): Promise<any> =>
      await actions.purchaseMedia({ contact_id, amount, chat_id, media_token }),
    restoreMessages: async (): Promise<any> => await actions.restoreMessages(self as MsgStore),
    seeChat: async (id: number): Promise<any> => await actions.seeChat(self as MsgStore, id),
    sendAnonPayment: async (params: SendAnonPaymentParams): Promise<void> =>
      await actions.sendAnonPayment(self as MsgStore, params),
    sendAttachment: async (params: SendAttachmentParams): Promise<void> =>
      await actions.sendAttachment(self as MsgStore, params),
    sendInvoice: async (params: SendInvoiceParams): Promise<void> =>
      await actions.sendInvoice(self as MsgStore, params),
    sendMessage: async (params: SendMessageParams): Promise<void> =>
      await actions.sendMessage(self as MsgStore, params),
    sendPayment: async (params: SendPaymentParams): Promise<void> =>
      await actions.sendPayment(self as MsgStore, params),
    setMessageAsReceived: async (m: any): Promise<void> =>
      await actions.setMessageAsReceived(self as MsgStore, m),
    setLastFetched(lastFetched: number) {
      self.lastFetched = lastFetched
    },
    setLastSeen(lastSeen: any) {
      self.lastSeen = lastSeen
    },
    setMessage: (msg: Msg) => {
      // const chat = (self as MsgStore).msgsForChatroom(msg.chat_id)
      const chat = self.messages.get(msg.chat_id.toString())
      if (chat) {
        // Ensure message doesn't already exist
        const exists = chat.find((m) => m.id === msg.id)
        if (!exists) {
          chat.unshift(msg)
          display({
            name: 'setMessage',
            preview: `Pushed msg to chat`,
            value: { chat, msg },
            important: true,
          })
        } else {
          display({
            name: 'setMessage',
            preview: `Msg already exists, didn't set`,
            value: { chat, msg },
            important: true,
          })
        }
      } else {
        self.messages.set(msg.chat_id.toString(), [msg])
        display({
          name: 'setMessage',
          preview: `First message in chat? Saved first msg ${msg.id}`,
          value: { msg },
          important: true,
        })
      }
      // self.messages.set(msg.id.toString(), msg)
      // ;(self as MsgStore).rebuildCache()
    },
    setMessages: (msgs: { [k: number]: any[] }) => {
      // display({
      //   name: 'New setMessages',
      //   preview: `Setting messages for ${Object.entries(msgs).length} chats`,
      //   value: { msgs },
      // })
      self.messages.merge(msgs)
      const len = Object.entries(msgs).length
      if (len > 1) {
        display({
          name: 'setMessages',
          preview: `Set messages for ${len} chats`,
          value: { messages: self.messages },
        })
      }
    },
    setMessagesOld: (msgs: Msg[]) => {
      display({
        name: 'setMessages',
        preview: `Setting ${msgs.length} messages`,
        value: { msgs },
      })
      const formattedArray: any[] = []
      const messagesByChatroom = {}
      msgs.forEach((msg) => {
        formattedArray.push([msg.id, msg])
        // if (typeof messagesByChatroom[msg.chat_id] === 'object') {
        //   messagesByChatroom[msg.chat_id].push(msg)
        // } else {
        //   messagesByChatroom[msg.chat_id] = []
        // }
      })

      // let sortedCachedMessages = {}
      // Object.entries(messagesByChatroom).forEach((entries: any) => {
      //   const k = entries[0]
      //   const v: Msg[] = entries[1]
      //   v.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
      //   sortedCachedMessages[k] = v
      // })

      // display({
      //   name: 'setMessages',
      //   preview: `Setting ${msgs.length} messages and caching`,
      //   value: { msgs, formattedArray, messagesByChatroom, sortedCachedMessages },
      // })

      self.messages.merge(formattedArray)
      display({
        name: 'setMessages',
        preview: `Merged ${formattedArray.length} messages`,
        // value: { msgs, messagesNow: self.messages },
      })
      // self.messageCache = sortedCachedMessages
    },
    reset: () => reset(self),
    // rebuildCache() {
    //   const msgs = Array.from(self.messages.values())
    //   const formattedArray: any[] = []
    //   const messagesByChatroom = {}
    //   msgs.forEach((msg) => {
    //     formattedArray.push([msg.id, msg])
    //     if (typeof messagesByChatroom[msg.chat_id] === 'object') {
    //       messagesByChatroom[msg.chat_id].push(msg)
    //     } else {
    //       messagesByChatroom[msg.chat_id] = []
    //     }
    //   })

    //   let sortedCachedMessages = {}
    //   Object.entries(messagesByChatroom).forEach((entries: any) => {
    //     const k = entries[0]
    //     const v: Msg[] = entries[1]
    //     v.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
    //     sortedCachedMessages[k] = v
    //   })

    //   display({
    //     name: 'rebuildCache',
    //     preview: `Setting ${msgs.length} messages and caching`,
    //     value: { msgs, formattedArray, messagesByChatroom, sortedCachedMessages },
    //   })

    //   self.messageCache = sortedCachedMessages
    // },
  }))
  .views((self) => ({
    countUnseenMessages(myid: number): number {
      const now = new Date().getTime()
      let unseenCount = 0
      const lastSeenObj = self.lastSeen
      const msgsEntries = entries(self.messages)
      msgsEntries.forEach(function ([id, msgs]) {
        const lastSeen = lastSeenObj[id || '_'] || now
        if (!msgs) return
        values(msgs).forEach((m) => {
          if (m.sender !== myid) {
            const unseen = moment(new Date(lastSeen)).isBefore(moment(m.date))
            if (unseen) unseenCount += 1
          }
        })
      })
      display({
        name: 'countUnseenMsgs',
        preview: `Unseen messages: ${unseenCount}`,
      })
      return unseenCount
    },
    filterMessagesByContent(id, filterString): any {
      const list = (self as MsgStore).msgsForChatroom(id)
      if (!list) return []
      const filteredMsgs = list.filter(
        (m) => !!m.message_content && m.message_content.includes(filterString)
      )
      // display({
      //   name: 'filterMessagesByContent',
      //   important: true,
      //   value: { list, id, filterString, filteredMsgs },
      // })
      return filteredMsgs
    },
    lengthOfAllMessages(): number {
      let l = 0
      for (let i in self.messages.values()) {
        console.log(i)
      }
      // self.messages.values().forEach((msgs) => {
      //   l += msgs.length
      // })
      return l
    },
    msgsForChatroomByUuid(uuid: string) {
      const root = getRoot(self) as RootStore
      const community = root.chats.communities.get(uuid)
      if (!community) return []
      const chat = community.chat
      if (!chat) return []
      // display({
      //   name: 'msgsForChatroomByUuid',
      //   preview: `Checking ${uuid} - community? CHAT`,
      //   important: true,
      //   value: { uuid, community, chat },
      // })
      const msgs = self.messages.get(chat.id.toString())
      if (!msgs) return []
      // display({
      //   name: 'msgsForChatroomByUuid',
      //   preview: `Returning ${msgs.length} msgsForChatroomByUuid ${uuid}`,
      //   important: true,
      //   value: { uuid, msgs },
      // })
      return values(msgs)
    },
    msgsForChatroom(chatId: number) {
      // display({
      //   name: 'msgsForChatroom',
      //   preview: `Attempting msgsForChatroom ${chatId}`,
      //   important: true,
      // })
      if (!chatId) {
        console.log('no msgsforchatroom for chatId', chatId)
        return []
      }
      const msgs = self.messages.get(chatId.toString())
      if (msgs) {
        // display({
        //   name: 'msgsForChatroom',
        //   preview: `Returning ${msgs.length} msgsForChatroom ${chatId}`,
        //   important: true,
        //   value: { chatId, msgs },
        // })
        return values(msgs)
      } else {
        // console.log('returning nothin for msgs')
        return []
      }

      // const msgs = values()
    },
    // get messagesArray(): Msg[] {
    //   return self.messages.values()
    //   // return Array.from(self.messages.values())
    // },
    // msgsForChatroom(chatId: number) {
    //   // const msgs = self.messageCache[chatId]
    //   // display({
    //   //   name: 'msgsForChatroom',
    //   //   preview: `Returning msgsForChatroom cache for chatId ${chatId}`,
    //   //   important: true,
    //   //   value: { msgs },
    //   // })
    //   // return msgs

    //   const msgArray = (self as MsgStore).messagesArray
    //   const msgs = msgArray
    //     .filter((msg) => msg.chat_id === chatId)
    //     .sort((a, b) => moment(b.date).unix() - moment(a.date).unix())

    //   // display({
    //   //   name: 'msgsForChatroom',
    //   //   preview: `LOOPING THROUGH ${msgArray.length} MSGS TWICE ????`,
    //   //   important: true,
    //   // })

    //   display({
    //     name: 'msgsForChatroom',
    //     preview: `msgsForChatroom ${chatId}`,
    //     value: { msgs, chatId },
    //   })
    //   return msgs
    // },
    sortAllMsgs(allms: { [k: number]: Msg[] }) {
      return false
      const final = {}
      let toSort: { [k: number]: Msg[] } = allms || JSON.parse(JSON.stringify(self.messages)) // ??

      display({
        name: 'sortAllMsgs',
        preview: `Trying to sort...`,
        value: { toSort, allms },
      })

      // Object.entries(toSort).forEach((entries) => {
      //   const k = entries[0]
      //   const v: Msg[] = entries[1]
      //   v.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
      //   final[k] = v
      // })

      display({
        name: 'sortAllMsgs',
        preview: `Skipping some set of messages...`,
        value: { final },
      })
      // this.messages = final
    },
  }))

type MsgStoreType = Instance<typeof MsgStoreModel>
export interface MsgStore extends MsgStoreType {}
type MsgStoreSnapshotType = SnapshotOut<typeof MsgStoreModel>
export interface MsgStoreSnapshot extends MsgStoreSnapshotType {}
export const createMsgStoreDefaultModel = () => types.optional(MsgStoreModel, {})
