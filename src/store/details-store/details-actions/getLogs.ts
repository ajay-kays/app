import { relay } from 'api'
import { DetailsStore } from 'store/details-store'

export async function getLogs(self: DetailsStore) {
  try {
    const r = await relay?.get('logs')
    if (r) self.setLogs(r)
  } catch (e) {
    console.log(e)
  }
}
