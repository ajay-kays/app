import * as base64 from 'base-64'
import { constants, constantCodes } from 'lib/constants'
import { reportError } from 'lib/errorHelper'
import { parseLDAT, urlBase64FromAscii } from 'lib/ldat'
import { display } from 'lib/logging'
import { values } from 'mobx'
import moment from 'moment'
import { useStores } from 'store'
import { Contact } from 'store/contacts-store'
import { Msg } from 'store/msg-store'

const tribe = constants.chat_types.tribe

export interface BoostMsg {
  amount: number
  date: string
  sender_alias: string
}

export function useAvatarColor(str) {
  const s = str || 'Sphinx'
  const hc = hashCode(s.repeat(Math.round(32 / s.length)))
  const int = Math.round(Math.abs((hc / 2147483647) * colorz.length))
  return colorz[Math.min(int, 20)]
}

export function useBoostSender(m, contactList, isTribe) {
  const sender = contactList.find((c) => c.id === m.sender)
  return {
    senderAlias: !isTribe ? sender?.alias : m.sender_alias,
    senderPic: isTribe ? m.sender_pic || '' : sender?.photo_url || '',
  }
}

export function useMsgs(chat, limit?: number) {
  const { chats, user, msg, contacts } = useStores()
  const myid = user.myid

  if (!chat) return

  let theID = chat.id
  const isTribe = chat.type === tribe
  if (!theID) {
    // for very beginning, where chat doesnt have id
    const theChat = chats.chatsArray.find(
      (ch) => ch.type === 0 && arraysEqual(ch.contact_ids, chat.contact_ids)
    ) // this is the problem
    if (theChat) theID = theChat.id // new chat pops in, from first message confirmation!
  }

  // Handle no messages - can't convert nothin to values
  const gotmsgs = msg.messages.get(theID)
  if (!gotmsgs) return []
  // const msgs = values(gotmsgs) // TODO: revert to LOL
  const msgs = gotmsgs // ??

  const shownMsgs = msgs && msgs.slice(0, limit || 1000)

  const messages = processMsgs(shownMsgs, isTribe, contacts.contactsArray, myid)

  const msgsWithDates = msgs && injectDates(messages)
  const ms: any = msgsWithDates || []
  // display({
  //   name: 'useMsgs',
  //   preview: `with chat id ${chat && chat.id}, limit ${limit ?? 'none'} - RETURNING:`,
  //   value: { chat, limit, initialMsgs: msgs, theID, returningMsgs: ms },
  // })
  return ms
}

// export const useMsgs = (chat: any = null) => {
//   return []
// }

export function useMsgSender(m, contactList, isTribe) {
  let senderAlias = ''
  const sender = contactList.find((c) => c.id === m.sender)
  let senderPic = (!isTribe && sender && sender.photo_url) || ''
  if (isTribe) {
    senderAlias = m.sender_alias
    if (m.sender_pic) senderPic = m.sender_pic
  } else {
    senderAlias = sender && sender.alias
  }
  return { senderAlias, senderPic }
}

export function useParsedClipMsg(message_content: string) {
  if (!message_content) return {}
  const arr = message_content.split('::')
  if (!(arr && arr[1])) return {}
  try {
    const r = JSON.parse(arr[1])
    return r
  } catch (e) {
    reportError(e)
    return {}
  }
}

export function useParsedGiphyMsg(message_content: string) {
  const arr = message_content.split('::')
  if (!arr?.[1]) return {}
  const dec = base64.decode(arr[1])
  try {
    const r = JSON.parse(dec)
    const aspectRatio = parseFloat(r.aspect_ratio)
    const thumb = r.url.replace(/giphy.gif/g, '200w.gif')
    return { ...r, aspectRatio, thumb }
  } catch (e) {
    return {}
  }
}

export function useParsedJsonMsg(message_content: string) {
  if (!message_content) return {}
  try {
    const r = JSON.parse(message_content)
    return r
  } catch (e) {
    reportError(e)
    return {}
  }
}

// TODO: Fix this custom hook logic in the future
/* eslint-disable react-hooks/rules-of-hooks */
export function useParsedJsonOrClipMsg(message_content) {
  if (!message_content) return {}
  if (message_content.includes('::')) return useParsedClipMsg(message_content)
  return useParsedJsonMsg(message_content)
}

// Helpers
function arraysEqual(_arr1, _arr2) {
  if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length) {
    return false
  }
  var arr1 = _arr1.concat().sort()
  var arr2 = _arr2.concat().sort()

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

const msgTypesNoInfoBar = [
  constants.message_types.member_request,
  constants.message_types.member_approve,
  constants.message_types.member_reject,
]
// only show info bar if first in a group from contact
function calcShowInfoBar(msgs: Msg[], msg: Msg, i: number, isTribe: boolean, myid: number) {
  if (msgTypesNoInfoBar.includes(msg.type)) return false
  const previous = getPrevious(msgs, i)

  if (!previous) return true
  if (isTribe && msg.sender !== myid) {
    // for self msgs, do normal way

    if (
      previous.sender_alias === msg.sender_alias &&
      previous.type !== constants.message_types.group_join &&
      previous.type !== constants.message_types.boost
    ) {
      return false
    }
  } else {
    if (
      previous.sender === msg.sender &&
      previous.type !== constants.message_types.group_join &&
      previous.type !== constants.message_types.boost
    ) {
      return false
    }
  }

  return true
}

const colorz = [
  '#FF70E9',
  '#7077FF',
  '#DBD23C',
  '#F57D25',
  '#9F70FF',
  '#9BC351',
  '#FF3D3D',
  '#C770FF',
  '#62C784',
  '#C99966',
  '#76D6CA',
  '#ABDB50',
  '#FF708B',
  '#5AD7F7',
  '#5FC455',
  '#FF9270',
  '#3FABFF',
  '#56D978',
  '#FFBA70',
  '#5078F2',
  '#618AFF',
]

// LIST IS REVERSED??
function getPrevious(msgs: Msg[], i: number) {
  if (i === 0) return null
  const previous = msgs[i - 1]
  const mtype = constantCodes.message_types[previous.type]
  if (hideTypes.includes(mtype)) {
    return getPrevious(msgs, i - 1)
  }
  return previous
}

function hashCode(str) {
  var hash = 0
  if (str.length == 0) return hash
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function injectDates(msgs: Msg[]) {
  let currentDate = ''
  const ms: any[] = []
  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i]
    const dateString = moment(msg.date).format('dddd DD')
    if (dateString !== currentDate) {
      if (i > 0) ms.splice(i + 1, 0, { dateLine: currentDate, id: rando() }) // inject date string
      currentDate = dateString
    }
    ms.push(msg)
  }
  return ms
}

// "payment" is for paying an invoice
const hideTypes = ['payment', 'purchase', 'purchase_accept', 'purchase_deny']
function processMsgs(incomingmsgs: Msg[], isTribe: boolean, contacts: Contact[], myid: number) {
  // "deep clone" the messages array
  const msgs = incomingmsgs && incomingmsgs.map((a) => Object.assign({}, a)).reverse()
  const ms: any[] = []
  if (!msgs) return ms
  for (let i = 0; i < msgs.length; i++) {
    let skip = false
    const msg = msgs[i]

    msg.showInfoBar = calcShowInfoBar(msgs, msg, i, isTribe, myid)
    const typ = constantCodes.message_types[msg.type]

    // attachment logic
    if (typ === 'attachment' && msg.sender !== myid) {
      // not from me
      const ldat = parseLDAT(msg.media_token)
      if (ldat && ldat.muid && ldat.meta && ldat.meta.amt) {
        const accepted = msgs.find((m) => {
          const mtype = constantCodes.message_types[m.type]
          const start = urlBase64FromAscii(ldat.host) + '.' + ldat.muid
          return (
            (mtype === 'purchase_accept' && m.media_token?.startsWith(start)) ||
            (isTribe && mtype === 'purchase_accept' && m.original_muid === ldat.muid)
          )
        })

        if (accepted) {
          msg.media_token = accepted.media_token
          msg.media_key = accepted.media_key
        }
      }
    }
    if (typ === 'attachment' && msg.sender === myid) {
      // from me
      const ldat = parseLDAT(msg.media_token)
      if (ldat && ldat.muid && ldat.meta && ldat.meta.amt) {
        const purchase = msgs.find((m) => {
          const mtype = constantCodes.message_types[m.type]
          const start = urlBase64FromAscii(ldat.host) + '.' + ldat.muid
          return mtype === 'purchase' && m.media_token?.startsWith(start)
        })
        if (purchase) {
          msg.sold = true
        }
      }
    }

    // reply logic
    if (typ === 'message' && msg.reply_uuid) {
      let senderAlias = ''
      const repmsg = msgs.find((m) => m.uuid === msg.reply_uuid)
      if (repmsg) senderAlias = repmsg.sender_alias ?? ''
      if (!senderAlias && !isTribe && repmsg && repmsg.sender) {
        const contact = contacts.find((c) => c.id === repmsg.sender)
        if (contact) senderAlias = contact.alias
      }
      if (repmsg) msg.reply_message_content = repmsg.message_content ?? undefined
      msg.reply_message_sender_alias = senderAlias
      if (repmsg) msg.reply_message_sender = repmsg.sender
    }

    // boost logic
    if (typ === 'boost' && msg.reply_uuid) {
      skip = true
      // look in "ms".. the existing result array. Its reversed so its forward in time
      const repmsg: any = ms.find((m: any) => m.uuid === msg.reply_uuid)
      if (repmsg) {
        const bm = <BoostMsg>{
          amount: msg.amount,
          sender_alias: msg.sender_alias,
          sender_pic: msg.sender_pic,
          date: msg.date,
          sender: msg.sender,
        }
        if (!repmsg.boosts) repmsg.boosts = [bm]
        else repmsg.boosts.push(bm)
        // add up total sats
        if (!repmsg.boosts_total_sats) repmsg.boosts_total_sats = msg.amount
        else repmsg.boosts_total_sats = repmsg.boosts_total_sats + msg.amount
      }
    }

    if (!typ) skip = true // unknown types
    if (hideTypes.includes(typ)) skip = true
    if (!skip) ms.push(msg)
  }
  return ms.reverse() // reverse it back to last msg first
}

function rando() {
  return Math.random().toString(12).substring(0)
}
