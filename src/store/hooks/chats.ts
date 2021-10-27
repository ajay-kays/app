import { constants } from 'lib/constants'
import moment from 'moment'
import { useStores } from 'store'
import { Chat } from 'store/chats-store'
import { Contact } from 'store/contacts-store'

const conversation = constants.chat_types.conversation
const group = constants.chat_types.conversation
const expiredInvite = constants.invite_statuses.expired

export function useChats() {
  const { chats, msg, contacts, user } = useStores()
  const theChats = allChats(chats.chatsArray, contacts.contactsArray, user.myid)
  const chatsToShow = theChats
  sortChats(chatsToShow, msg.messages)

  return chatsToShow
}

export function allChats(chats: Chat[], contacts: Contact[], myid: number): Chat[] {
  const groupChats = chats.filter((c) => c.type !== conversation).map((c) => ({ ...c }))
  const conversations: any[] = []

  contacts.forEach((contact) => {
    if (contact.id !== myid && !contact.from_group) {
      const chatForContact = chats.find((c) => {
        return c.type === conversation && c.contact_ids.includes(contact.id)
      })
      if (chatForContact) {
        // add in name = contact.name
        conversations.push({ ...chatForContact, name: contact.alias })
      } else {
        conversations.push({
          // "fake" chat (first)
          name: contact.alias,
          photo_url: contact.photo_url,
          updated_at: new Date().toJSON(),
          contact_ids: [myid, contact.id],
          invite: contact.invite,
          type: conversation,
        })
      }
    }
  })
  const convs = conversations.filter((c) => !(c.invite && c.invite.status === expiredInvite))
  const all = groupChats.concat(convs)
  return all
}

export function sortChats(chatsToShow, messages) {
  chatsToShow.sort((a, b) => {
    const amsgs = messages[a.id]
    const alastMsg = amsgs && amsgs[0]
    const then = moment(new Date()).add(-30, 'days')
    const adate = alastMsg && alastMsg.date ? moment(alastMsg.date) : then
    const bmsgs = messages[b.id]
    const blastMsg = bmsgs && bmsgs[0]
    const bdate = blastMsg && blastMsg.date ? moment(blastMsg.date) : then
    return adate.isBefore(bdate) ? 0 : -1
  })
  chatsToShow.sort((a) => {
    if (a.invite && a.invite.status !== 4) return -1
    return 0
  })
}
