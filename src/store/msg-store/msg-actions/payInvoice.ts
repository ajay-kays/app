import { relay } from 'api'
import { MsgStore } from '../msg-store'

export const payInvoice = async (self: MsgStore, payment_request: string, amount: number) => {
  try {
    const v = { payment_request }
    const r = await relay?.put('invoices', v)
    if (!r) return
    self.invoicePaid({ ...r, amount })
  } catch (e) {
    console.log(e)
  }
}
