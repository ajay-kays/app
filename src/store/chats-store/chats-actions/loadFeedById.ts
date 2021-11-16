import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import { reportError } from 'lib/errorHelper'
import { ChatsStore } from '../chats-store'

export const loadFeedById = async (self: ChatsStore, id: string) => {
  if (!id) return
  try {
    const r = await fetch(`https://${DEFAULT_TRIBE_SERVER}/podcast?id=${id}`)
    const j = await r.json()
    return j
  } catch (e) {
    reportError(e)
  }
}
