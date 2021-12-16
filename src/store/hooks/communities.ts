import moment from 'moment'
import { constants } from 'lib/constants'
import { calendarDate } from 'lib/date'
import { useStores } from 'store'
import { useChats } from './chats'
import { Msg } from 'store/msg-store'
import { display } from 'lib/logging'

// HOOKS

let tribeLoops = 0

// export function useCommunities() {
//   const { chats, user } = useStores()
//   const chatsToShow = useChats()

//   if (!chats.communities) {
//     console.log('useCommunities - no chats tribes, returning []')
//     return []
//   }
//   // const theCommunities = allCommunities(chats.communitiesArray, chatsToShow, user)
//   const theCommunities = chats.communitiesArray
//   display({
//     name: 'useCommunities',
//     preview: 'theCommunities',
//     value: { theCommunities },
//     important: true,
//   })

//   return theCommunities
// }

export function useCommunityHistory(created, lastActive) {
  const createdDate = calendarDate(moment(created), 'MMM DD, YYYY')
  const lastActiveDate = calendarDate(moment.unix(lastActive), 'MMM DD, YYYY')

  return { createdDate, lastActiveDate }
}

export function useCommunityMediaType(msgs, type) {
  return msgs.filter(
    (m) =>
      m.type === type &&
      m.media_token &&
      m.media_type.startsWith('image') &&
      m.status !== constants.statuses.deleted
  )
}

export function useOwnedCommunities(tribes) {
  // tribes = tribes.filter(t => t.owner)
  console.log('tribes before:', tribes.length)
  tribes = tribes.filter((t) => t.joined)
  console.log('tribes after:', tribes.length)
  // console.log('returning tribes:', tribes)
  return useSortTribesByLastMsg(tribes)

  // return tribes.sort((a, b) => {
  //   if (a.joined > b.owner && b.last_active > a.last_active) return -1
  //   return 0
  // })
}

// New hook for new media message cache thing
export function useOwnerMedia(msgs, tribe, type, myId): Array<Msg> {
  if (!tribe || !tribe.chat || !tribe.chat.id || tribe.chat.id === 1 || !msgs) return []
  return msgs
    .filter((m: Msg) => {
      const matchTypeMessage = m.type === type
      const messageWithValidStatus = m.status !== constants.statuses.deleted

      let ownerCriteria = false
      if (tribe.owner) {
        ownerCriteria = m.sender === myId
      } else {
        // if not owener id will not work.
        // depend on sender alias
        // ownerCriteria
        ownerCriteria = m.sender_alias === tribe.owner_alias
      }

      return matchTypeMessage && messageWithValidStatus && ownerCriteria
    })
    .sort((a, b) => moment(b.created_at).unix() - moment(a.created_at).unix())
}

// tribes not joined yet.
export function useSearchCommunities(tribes) {
  const { ui } = useStores()

  // tribes = tribes.filter(t => !t.owner).sort((a, b) => a.joined - b.joined)

  tribes = tribes
    .filter(
      (t) =>
        !t.joined &&
        t.name !== 'Jp sears awakened warriors' &&
        t.name !== 'JP Sears Awakened Community'
    )
    .sort((a) => (!a.img ? 1 : -1))

  return searchTribes(tribes, ui.tribesSearchTerm)
}

// HELPERS

export function allCommunities(tribes, chats, user) {
  // console.log('allCommunities.')
  const chatsuids = chats.map((c) => c.uuid)
  const ownedChats = chats.filter(
    (c) => c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey
  )
  if (!tribes || !tribes.length) return []
  const tribesToReturn = tribes.map((tribe) => {
    tribeLoops++
    return {
      ...tribe,
      chat: chatsuids && chats.find((c) => c.uuid === tribe.uuid),
      joined: chatsuids ? (chatsuids.find((uuid) => uuid === tribe.uuid) ? true : false) : false,
      owner: ownedChats ? (ownedChats.find((c) => c.uuid === tribe.uuid) ? true : false) : false,
    }
  })
  console.log('tribeLoops:', tribeLoops)
  return tribesToReturn
}

export function searchTribes(tribes, searchTerm) {
  return tribes.filter((c) => {
    if (!searchTerm) return true

    return (
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })
}

function useSortTribesByLastMsg(tribesToShow) {
  const {
    // chats,
    msg: { msgsForChatroomByUuid },
  } = useStores()

  // display({
  //   name: 'useSortTribesByLastMsg',
  //   preview: 'tribesToShow',
  //   value: { tribesToShow },
  // })

  return tribesToShow.sort((a, b) => {
    const amsgs = msgsForChatroomByUuid(a.uuid)
    const alastMsg = amsgs?.[0]
    const then = moment(new Date()).add(-30, 'days')
    const adate = alastMsg?.date ? moment(alastMsg.date) : then
    const bmsgs = msgsForChatroomByUuid(b.uuid)
    const blastMsg = bmsgs?.[0]
    const bdate = blastMsg?.date ? moment(blastMsg.date) : then
    return adate.isBefore(bdate) ? 0 : -1
  })
}
