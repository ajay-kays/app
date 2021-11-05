import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { constants } from 'lib/constants'
import { RootStore } from 'store'
import { encryptText, makeRemoteTextMap, putIn } from '../msg-helpers'
import { MsgStore } from '../msg-store'
import moment from 'moment'
import { normalizeMessage } from 'store/normalize'
import { display, log } from 'lib/logging'

export const sendMessage = async (
  self: MsgStore,
  { contact_id, text, chat_id, amount, reply_uuid, boost, message_price }: SendMessageParams
) => {
  const root = getRoot(self) as RootStore
  try {
    const myId = root.user.myid
    const encryptedText = await encryptText(root, { contact_id: myId, text })

    const remote_text_map = await makeRemoteTextMap(root, {
      contact_id,
      text,
      chat_id,
    })

    const v: { [k: string]: any } = {
      contact_id,
      chat_id: chat_id || null,
      text: encryptedText,
      remote_text_map,
      amount: amount || 0,
      reply_uuid,
      boost: boost || false,
    }

    if (message_price) v.message_price = message_price

    display({
      name: 'sendMessage',
      preview: 'About to send message',
      value: { v },
    })

    // const r = await relay?.post('messages', v)
    // this.gotNewMessage(r)

    if (!chat_id) {
      const r = await relay?.post('messages', v)

      // display({
      //   name: 'sendMessage',
      //   preview: 'RETURNED WITH (no chat_id)',
      //   value: { r },
      //   important: true,
      // })

      if (!r) return
      self.gotNewMessage(r)

      // const normalizedMessage = normalizeMessage(r)
      // self.gotNewMessage(normalizedMessage)
    } else {
      const putInMsgType = boost ? constants.message_types.boost : constants.message_types.message

      const amt = boost && message_price && message_price < amount ? amount - message_price : amount
      display({
        name: 'sendMessage',
        preview: 'Skipping horrible sendMessage thing',
        value: { putInMsgType, amt },
        important: true,
      })
      // putIn(
      //   self.messages,
      //   {
      //     ...v,
      //     id: -1,
      //     sender: myId,
      //     amount: amt,
      //     date: moment().toISOString(),
      //     type: putInMsgType,
      //     message_content: text,
      //   },
      //   chat_id
      // )
      const r = await relay?.post('messages', v)

      if (!r) return
      // const normalizedMessage = normalizeMessage(r)
      // self.gotNewMessage(normalizedMessage)
      display({
        name: 'sendMessage',
        preview: 'RETURNED WITH (yes chat_id)',
        value: { r },
        important: true,
      })
      self.gotNewMessage(r)
      // self.messagePosted(r)
      // display({
      //   name: 'sendMessage',
      //   preview: 'messagePosted placeholder',
      //   value: { r },
      //   important: true,
      // })
      if (amount) root.details.addToBalance(amount * -1)
    }
  } catch (e) {
    // showToastIfContactKeyError(e)
    log(e)
  }
}

export interface SendMessageParams {
  contact_id: number | null
  text: string
  chat_id: number | null
  amount: number
  reply_uuid: string
  boost?: boolean
  message_price?: number
}
