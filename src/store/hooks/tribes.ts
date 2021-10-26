import { constants } from 'lib/constants'

export function useTribeMediaType(msgs, type) {
  return msgs.filter(
    (m) =>
      m.type === type &&
      m.media_token &&
      m.media_type.startsWith('image') &&
      m.status !== constants.statuses.deleted
  )
}
