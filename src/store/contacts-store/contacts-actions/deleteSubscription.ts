import { relay } from 'api'

export const deleteSubscription = async (id: number) => {
  try {
    const s = await relay?.del(`subscription/${id}`)
    console.log(s)
  } catch (e) {
    console.log(e)
  }
}
