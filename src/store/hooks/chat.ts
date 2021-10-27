import { DEFAULT_DOMAIN } from 'lib/config'
import { constants } from 'lib/constants'
import moment from 'moment'
import { useStores } from 'store'

export function useChatReply(msgs, replyUUID) {
  let replyMessage = msgs && replyUUID && msgs.find((m) => m.uuid === replyUUID)

  return {
    replyMessage,
  }
}

export function useChatRow(id) {
  const { user, msg } = useStores()
  const myid = user.myid

  const msgs = msg.msgsForChatroom(id || '_')
  const lastMsg = msgs && msgs[0]
  const lastMsgText = lastMessageText(lastMsg, myid)
  const hasLastMsg = lastMsgText ? true : false

  const now = new Date().getTime()
  const lastSeen = msg.lastSeen[id || '_'] || now
  const unseenCount = countUnseen(msgs, lastSeen, myid)
  const hasUnseen = unseenCount > 0 ? true : false

  const lastMsgDate = lastMessageDate(lastMsg)

  return { lastMsgText, lastMsgDate, hasLastMsg, unseenCount, hasUnseen }
}

function countUnseen(msgs, lastSeen: number, myid: number): number {
  if (!msgs) return 0
  let unseenCount = 0
  msgs.forEach((m) => {
    if (m.sender !== myid) {
      const unseen = moment(new Date(lastSeen)).isBefore(moment(m.date))
      if (unseen) unseenCount += 1
    }
  })
  return Math.min(unseenCount, 99)
}

function lastMessageDate(msg) {
  if (!msg || !msg.date) return ''

  return moment(msg.date).calendar(null, {
    lastDay: '[Yesterday]',
    sameDay: 'hh:mm A',
    nextDay: '[Tomorrow]',
    lastWeek: 'dddd',
    nextWeek: 'dddd',
    sameElse: 'L',
  })
}

function lastMessageText(msg, myid) {
  if (!msg) return ''
  if (msg.type === constants.message_types.bot_res) {
    return msg.sender_alias ? `${msg.sender_alias} says...` : 'Bot Response'
  }
  if (msg.type === constants.message_types.boost) {
    return `Boost: ${msg.amount} sats`
  }
  if (msg.message_content) {
    const verb = msg.sender === myid ? 'shared' : 'received'
    if (msg.message_content.startsWith('giphy::')) return 'GIF ' + verb
    if (msg.message_content.startsWith('clip::')) return 'Clip ' + verb
    if (msg.message_content.startsWith('boost::')) return 'Boost ' + verb
    if (msg.message_content.startsWith(`${DEFAULT_DOMAIN}://?action=tribe`))
      return 'Tribe Link ' + verb
    if (msg.message_content.startsWith('https://jitsi.sphinx.chat/')) return 'Join Call'
    return msg.message_content
  }
  if (msg.amount) {
    const kind = msg.type === constants.message_types.invoice ? 'Invoice' : 'Payment'
    if (msg.sender === myid) return `${kind} Sent: ${msg.amount} sat`
    return `${kind} Received: ${msg.amount} sat`
  }
  if (msg.media_token && msg.media_type) {
    const mediaType = msg.media_type
    let fileType = 'File'
    if (mediaType.startsWith('video')) fileType = 'Video'
    if (mediaType.startsWith('image')) fileType = 'Picture'
    if (mediaType.startsWith('audio')) fileType = 'Audio'
    if (msg.sender === myid) return fileType + ' Sent'
    return fileType + ' Received'
  }
  return ''
}
