import { DetailsStore } from 'store/details-store'

export function clearLogs(self: DetailsStore) {
  self.setLogs('')
}
