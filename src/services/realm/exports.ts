import { hasData, get, update, initialLoad } from './api'
import { Platform } from 'react-native'
import { Msg, orgMsgsFromRealm } from 'store/msg-store'
import { display } from 'lib/logging'
// import { Msg } from '../store/msg'
// import { orgMsgsFromRealm } from '../store/msgHelpers'

export { hasData, initialLoad }
/***
 * Update Msg schema in realm
 ***/
interface Data {
  messages: { [k: number]: Msg[] }
  lastSeen: { [k: number]: number }
  lastFetched: number
  oldestMessage: number | null
  newestMessage: number | null
}

export function getRealmMessages() {
  let parsedData: any = null
  const ret: Data = {
    messages: {},
    lastSeen: {},
    lastFetched: new Date().getTime(),
    oldestMessage: null,
    newestMessage: null,
  }
  const hasRealmData = hasData()
  if (hasRealmData.msg) {
    const [realmMsg] = get({ schema: 'Msg' })
    parsedData = JSON.parse(JSON.stringify(realmMsg))

    if (parsedData.messages) {
      const organizedMsgs = orgMsgsFromRealm(parsedData.messages)
      if (parsedData.lastSeen.length) {
        const obj = {}
        parsedData.lastSeen.forEach((ls: any) => {
          obj[ls.key] = ls.seen
        })
        ret.lastSeen = obj
      }
      ret.messages = organizedMsgs

      const sortedMsgs = parsedData.messages.sort((a, b) => {
        const bd: any = new Date(b.created_at)
        const ad: any = new Date(a.created_at)
        return bd - ad
      })
      // display({
      //   name: 'getRealmMessages',
      //   preview: 'parsedData+sortedMsgs for getRealmMessages to getMessages2',
      //   value: {
      //     parsedData,
      //     sortedMsgs,
      //     oldest: new Date(sortedMsgs[sortedMsgs.length - 1].created_at).getTime(),
      //     newest: new Date(sortedMsgs[0].created_at).getTime(),
      //   },
      //   important: true,
      // })
      ret.oldestMessage = new Date(sortedMsgs[sortedMsgs.length - 1].created_at).getTime()
      ret.newestMessage = new Date(sortedMsgs[0].created_at).getTime()
    }
  }
  display({
    name: 'getRealmMessages',
    preview: `Got ${parsedData.messages?.length ?? 0} realm messages`,
    value: { ret, parsedData },
  })
  return ret
}

export function updateRealmMsg(data: any) {
  // Data
  if (Platform.OS === 'web') return

  console.log('UPDATE DATA IN REALM NOW!')

  const hasRealmData = hasData()

  if (hasRealmData.msg) {
    const allMessages: any = []

    const messagesArray = Array.from(data.messages)
    messagesArray.forEach((c: any) => {
      c[1].forEach((msg: any) => {
        allMessages.push({
          ...msg,
          amount: parseInt(msg.amount) || 0,
        })
      })
    })

    // Object.values(data.messages).forEach((c: any) => {
    //   c.forEach((msg: any) => {
    //     allMessages.push({
    //       ...msg,
    //       amount: parseInt(msg.amount) || 0,
    //     })
    //   })
    // })

    const lastSeen = Object.keys(data.lastSeen).map((key) => ({
      key: parseInt(key),
      seen: data.lastSeen[key],
    }))

    const msgStructure = {
      messages: allMessages,
      lastSeen,
      lastFetched: data.lastFetched || null,
    }

    display({
      name: 'updateRealmMsg',
      preview: 'What we got?',
      important: true,
      value: { hasRealmData, msgStructure },
    })

    update({
      schema: 'Msg',
      body: { ...msgStructure },
    })
  } else {
    display({
      name: 'updateRealmMsg',
      preview: 'No realm data to update.',
      important: true,
      value: { hasRealmData },
    })
  }
}
