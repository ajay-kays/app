import { relay } from 'api'
import { Msg } from 'store/msg-store'

export const getPayments = async () => {
  try {
    const r: Array<Msg> = await relay?.get('payments')
    return r
  } catch (e) {
    console.log(e)
  }
}
