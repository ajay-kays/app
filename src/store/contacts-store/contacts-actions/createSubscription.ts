import { relay } from 'api'

export const createSubscription = async (v: any) => {
  if (!v.amount || !v.interval || !(v.contact_id || v.chat_id)) {
    return console.log('createSubscription: missing param')
  }
  try {
    const s = await relay?.post('subscriptions', v)
    console.log(s)
    return s
  } catch (e) {
    console.log(e)
  }
}
