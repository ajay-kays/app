import { relay } from 'api'

export const editSubscription = async (id: number, v: any) => {
  if (!id || !v.amount || !v.interval || !(v.contact_id || v.chat_id)) {
    return console.log('editSubscription: missing param')
  }
  try {
    const s = await relay?.put(`subscription/${id}`, v)
    return s
  } catch (e) {
    console.log(e)
  }
}
