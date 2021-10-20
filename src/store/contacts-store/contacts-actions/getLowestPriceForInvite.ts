import { invite } from 'api'

export const getLowestPriceForInvite = async () => {
  try {
    const r = await invite.get('nodes/pricing')
    if (r && (r.price || r.price === 0)) return r.price
  } catch (e) {
    console.log(e)
  }
}
