import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { MsgStore } from '../msg-store'
import { encryptText, makeRemoteTextMap } from '../msg-helpers'

export const sendAttachment = async (
  self: MsgStore,
  { contact_id, text, chat_id, muid, media_type, media_key, price, amount }: SendAttachmentParams
) => {
  const root = getRoot(self) as RootStore
  try {
    const media_key_map = await makeRemoteTextMap(
      root,
      { contact_id, text: media_key, chat_id },
      true
    )
    const v: { [k: string]: any } = {
      contact_id,
      chat_id: chat_id || null,
      muid,
      media_type,
      media_key_map,
      amount: amount || 0,
    }
    if (price) v.price = price
    if (text) {
      const myid = root.user.myid
      const encryptedText = await encryptText(root, { contact_id: myid, text })
      const remote_text_map = await makeRemoteTextMap(root, {
        contact_id,
        text,
        chat_id,
      })
      v.text = encryptedText
      v.remote_text_map = remote_text_map
    }
    const r = await relay?.post('attachment', v)

    if (!r) return
    self.gotNewMessage(r)
  } catch (e) {
    // showToastIfContactKeyError(e)
    console.log(e)
  }
}

export interface SendAttachmentParams {
  contact_id: number
  text: string
  chat_id: number
  muid: number
  media_type: string
  media_key: string
  price: number
  amount: number
}
