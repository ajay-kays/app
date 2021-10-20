import { relay } from 'api'
import { DetailsStore } from 'store/details-store'

export async function getUSDollarRate(self: DetailsStore) {
  try {
    const r = await relay?.get('balance/all')
    if (!r) return

    const lb = r.local_balance && parseInt(r.local_balance, 10)
    const rb = r.remote_balance && parseInt(r.remote_balance, 10)

    self.setLocalBalance(lb || 0)
    self.setRemoteBalance(rb || 0)
  } catch (e) {
    console.log(e)
  }
}
