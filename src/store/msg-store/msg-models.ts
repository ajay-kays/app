import { Platform } from 'react-native'
import { Instance, types } from 'mobx-state-tree'
import { ChatModel } from 'store/chats-store'

export const MAX_MSGS_PER_CHAT = Platform.OS === 'android' ? 100 : 500 // 1000
export const MAX_MSGS_RESTORE = Platform.OS === 'android' ? 5000 : 50000

export const BoostMsgModel = types.model('BoostMsg').props({})

export const MsgModel = types
  .model('Msg')
  .props({
    id: types.identifierNumber,
    // chat: types.safeReference(ChatModel),
    chatRef: types.safeReference(ChatModel),
    chat_id: types.number, // will need to be reference
    type: types.number,
    uuid: types.optional(types.string, ''),
    sender: types.number,
    receiver: types.maybeNull(types.number),
    amount: types.number,
    amount_msat: types.number,
    payment_hash: types.maybeNull(types.string),
    payment_request: types.maybeNull(types.string),
    date: types.string,
    expiration_date: types.maybeNull(types.string),
    message_content: types.maybeNull(types.string),
    remote_message_content: types.maybeNull(types.string),
    status: types.maybeNull(types.number),
    status_map: types.frozen(),
    parent_id: types.maybeNull(types.number),
    subscription_id: types.maybeNull(types.number),
    media_type: types.maybeNull(types.string),
    media_token: types.maybeNull(types.string),
    media_key: types.maybeNull(types.string),
    seen: types.boolean,
    created_at: types.string,
    updated_at: types.string,
    sender_alias: types.maybeNull(types.string),
    sender_pic: types.maybeNull(types.string),

    original_muid: types.maybeNull(types.string),
    reply_uuid: types.maybeNull(types.string),

    text: types.maybe(types.string),
    // chat: types.maybe(types.safeReference(ChatModel)),
    chat: types.frozen(),
    // chat: ChatModel,

    sold: types.maybe(types.boolean), // this is a marker to tell if a media has been sold
    showInfoBar: types.maybe(types.boolean), // marks whether to show the date and name

    reply_message_content: types.maybe(types.string),
    reply_message_sender_alias: types.maybe(types.string),
    reply_message_sender: types.maybe(types.number),

    boosts_total_sats: types.maybe(types.number),
    boosts: types.frozen(), // types.array(BoostMsgModel)
  })
  .actions((self) => ({
    setChatRef: (ref: any) => {
      self.chatRef = ref
    },
  }))

//

export interface Msg extends Instance<typeof MsgModel> {}
export interface BoostMsg extends Instance<typeof BoostMsgModel> {}

/**

export interface Msg {
  id: number
  chat_id: number
  type: number
  uuid: string
  sender: number
  receiver: number
  amount: number
  amount_msat: number
  payment_hash: string
  payment_request: string
  date: string
  expiration_date: string
  message_content: string
  remote_message_content: string
  status: number
  status_map: { [k: number]: number }
  parent_id: number
  subscription_id: number
  media_type: string
  media_token: string
  media_key: string
  seen: boolean
  created_at: string
  updated_at: string
  sender_alias: string
  sender_pic: string

  original_muid: string
  reply_uuid: string

  text: string

  chat: Chat

  sold: boolean // this is a marker to tell if a media has been sold
  showInfoBar: boolean // marks whether to show the date and name

  reply_message_content: string
  reply_message_sender_alias: string
  reply_message_sender: number

  boosts_total_sats: number
  boosts: BoostMsg[]
}

 */
