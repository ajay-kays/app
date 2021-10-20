import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { MsgStore } from '../msg-store'
import { encryptText } from '../msg-helpers'

export const sendInvoice = async (
  self: MsgStore,
  { contact_id, amt, chat_id, memo }: SendInvoiceParams
) => {
  const root = getRoot(self) as RootStore
  try {
    const myid = root.user.myid
    const myenc = await encryptText(root, { contact_id: myid, text: memo })
    const encMemo = await encryptText(root, { contact_id, text: memo })
    const v = {
      contact_id,
      chat_id: chat_id || null,
      amount: amt,
      memo: myenc,
      remote_memo: encMemo,
    }
    const r = await relay?.post('invoices', v) // raw invoice:
    if (!r) return
    self.gotNewMessage(r)
  } catch (e) {
    console.log(e)
  }
}

export interface SendInvoiceParams {
  contact_id: number
  amt: number
  chat_id: number
  memo: string
}
