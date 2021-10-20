import { relay } from 'api'

export const getSubscriptionForContact = async (contactID: number) => {
  try {
    const s = await relay?.get(`subscriptions/contact/${contactID}`)
    return s
  } catch (e) {
    console.log(e)
  }
}
