import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { MsgStore } from '../msg-store'

export const sendAnonPayment = async (
  self: MsgStore,
  { amt, dest, memo }: SendAnonPaymentParams
) => {
  try {
    const v = {
      amount: amt,
      destination_key: dest,
      text: memo,
    }
    const r = await relay?.post('payment', v)
    if (!r) return
    const root = getRoot(self) as RootStore
    if (r.amount) root.details.addToBalance(r.amount * -1)
  } catch (e) {
    console.log(e)
  }
}

export interface SendAnonPaymentParams {
  amt: number
  dest: string
  memo: string
}
