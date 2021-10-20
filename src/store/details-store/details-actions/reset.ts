import { DetailsStore } from 'store/details-store'
export function reset(self: DetailsStore) {
  self.setBalance(0)
  self.setLogs('')
}
