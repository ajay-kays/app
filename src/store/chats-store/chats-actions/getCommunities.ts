import { ChatsStore } from '../chats-store'
import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import { display } from 'lib/logging'
import { normalizeCommunity } from 'store/normalize'
import { reportError } from 'lib/errorHelper'

let COMMUNITIES_LAST_FETCHED: any = null
const SAVE_INTERVAL = 8

export const getCommunities = async (self: ChatsStore, force: boolean = false) => {
  if (!!COMMUNITIES_LAST_FETCHED) {
    const now = new Date()
    const dif = now.getTime() - COMMUNITIES_LAST_FETCHED.getTime() // works w null?
    const secondsSinceLastSent = dif / 1000

    if (secondsSinceLastSent < SAVE_INTERVAL && !force) {
      console.log('skipping getcommunites fetch')
      return false
    }
    console.log('going to fetch getcommunities')
  }
  COMMUNITIES_LAST_FETCHED = new Date()

  try {
    const r = await fetch(`https://${DEFAULT_TRIBE_SERVER}/tribes`)
    const j = await r.json()

    const communitiesToSave: any[] = []
    j.forEach((community) => {
      const alreadyExists = self.communities.get(community.uuid)
      if (alreadyExists) {
        return
      }
      const normalizedCommunity = normalizeCommunity(community)
      if (normalizedCommunity) {
        communitiesToSave.push(community)
      }
    })

    self.setCommunities(communitiesToSave)

    // display({
    //   name: 'getCommunities',
    //   preview: 'communitiesToSave',
    //   value: { communitiesToSave, j },
    //   important: true,
    // })

    return true
  } catch (e) {
    console.log(e)
    console.log('getCommunities Error')
    reportError(e)

    return false
  }
}
