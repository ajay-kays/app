import { ChatsStore } from '../chats-store'
import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import { display } from 'lib/logging'

export const getTribeDetails = async (self: ChatsStore, host: string, uuid: string) => {
  if (!host || !uuid) return
  const theHost = host.includes('localhost') ? DEFAULT_TRIBE_SERVER : host
  try {
    const r = await fetch(`https://${theHost}/tribes/${uuid}`)
    const j = await r.json()
    if (j.bots) {
      try {
        const bots = JSON.parse(j.bots)
        j.bots = bots
      } catch (e) {
        j.bots = []
      }
    }
    display({
      name: 'getTribeDetails',
      value: { j },
      important: true,
    })
    return j
  } catch (e) {
    console.log(e)
  }
}
