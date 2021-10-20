import { relay } from 'api'

export const toggleSubscription = async (sid: number, paused: boolean) => {
  try {
    const s = await relay?.put(`subscription/${sid}/${paused ? 'restart' : 'pause'}`)
    if (s) return true
  } catch (e) {
    console.log(e)
  }
}
