import { relay } from 'api'

export const createRawInvoice = async (amt: number, memo: string) => {
  try {
    const v = { amount: amt, memo }
    const r = await relay?.post('invoices', v)
    return r
    // r = {invoice: payment_request}
  } catch (e) {
    console.log(e)
  }
}
