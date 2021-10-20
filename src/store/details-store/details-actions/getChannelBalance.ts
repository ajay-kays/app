import { relay } from 'api'
import { DetailsStore } from 'store/details-store'

export const getChannelBalance = async (self: DetailsStore) => {
  try {
    const r = await relay?.get('balance/all')
    if (!r) return

    const lb = r.local_balance && parseInt(r.local_balance)
    const rb = r.remote_balance && parseInt(r.remote_balance)

    self.setLocalBalance(lb || 0)
    self.setRemoteBalance(rb || 0)
  } catch (e) {
    console.log(e)
  }
}
