import { display } from 'lib/logging'
import { create, hasData, delet } from './'
import { InitialLoad } from './types/initialLoad.interface'

/**
 * Initial load function that load the data of Contacts, Chats y Msg in realm
 * @param {Array<object | any>} props.contacts - Array of all the contact data
 */
export default (props: InitialLoad) => {
  const { contacts, chats, msg } = props
  let response: any = null
  try {
    const hasRealmData = hasData()
    // if (contacts && !hasRealmData.contacts) {
    //   // Object.values requires that input parameter not be null or undefined
    //   display({
    //     name: 'initialLoad',
    //     preview: 'ATTEMPTING CONTACT CREATE WITH:',
    //     value: { contacts },
    //     important: true,
    //   })
    //   contacts.forEach((contact: any) => {
    //     create({
    //       schema: 'Contacts',
    //       body: {
    //         ...contact,
    //         deleted: +contact.deleted,
    //         is_owner: +contact.is_owner,
    //         from_group: +contact.from_group,
    //         private_photo: +contact.private_photo,
    //       },
    //     })
    //   })
    //   display({
    //     name: 'initialLoad',
    //     preview: 'Contact create succeeded?',
    //     important: true,
    //   })
    // }

    // if (chats && !hasRealmData.chats) {
    //   display({
    //     name: 'initialLoad',
    //     preview: 'ATTEMPTING CHAT CREATE WITH:',
    //     value: { chats },
    //     important: true,
    //   })
    //   chats.forEach((chat: any) => {
    //     console.log(chat.contact_ids)
    //     create({
    //       schema: 'Chats',
    //       body: {
    //         ...chat,
    //         contact_ids: Array.from(chat.contact_ids),
    //         pending_contact_ids: Array.from(chat.pending_contact_ids),
    //         deleted: +chat.deleted,
    //         is_muted: +chat.is_muted,
    //         private: +chat.private,
    //         status: parseInt(chat.status).toString(),
    //         unlisted: +chat.unlisted,
    //       },
    //     })
    //   })
    //   display({
    //     name: 'initialLoad',
    //     preview: 'Chat create succeeded?',
    //     important: true,
    //   })
    // }

    // display({
    //   name: 'initialLoad',
    //   preview: 'Msg wat.',
    //   value: {
    //     msg,
    //     messages: msg.messages,
    //     messagesArray: Array.from(msg.messages),
    //     wat: hasRealmData.msg,
    //     hasRealmData,
    //     // messagesObject: Object.values(msg.messages),
    //   },
    //   important: true,
    // })

    if (msg && !hasRealmData.msg) {
      // && msg.messages
      display({
        name: 'initialLoad',
        preview: 'ATTEMPTING MSG CREATE WITH:',
        value: {
          msg,
          messages: msg.messages,
          messagesArray: Array.from(msg.messages),
          // messagesObject: Object.values(msg.messages),
        },
        important: true,
      })
      const allMessages: any = []

      const messagesArray = Array.from(msg.messages)
      messagesArray.forEach((c: any) => {
        c[1].forEach((msg: any) => {
          allMessages.push({
            ...msg,
            amount: parseInt(msg.amount) || 0,
          })
        })
      })

      // Object.values(msg.messages).forEach((c: any) => {
      //   console.log(c)
      //   c.forEach((msg: any) => {
      //     allMessages.push({
      //       ...msg,
      //       amount: parseInt(msg.amount) || 0,
      //     })
      //   })
      // })

      const lastSeen = Object.keys(msg.lastSeen).map((key) => ({
        key: parseInt(key),
        seen: msg.lastSeen[key],
      }))

      const msgStructure = {
        messages: allMessages,
        lastSeen,
        lastFetched: msg.lastFetched || null,
      }

      create({
        schema: 'Msg',
        body: { ...msgStructure },
      })

      display({
        name: 'initialLoad',
        preview: 'Msg create succeeded?',
        value: { msgStructure },
        important: true,
      })

      messagesArray.forEach((message: any) => {
        create({
          schema: 'Messages',
          body: {
            ...message,
            // deleted: +contact.deleted,
            // is_owner: +contact.is_owner,
            // from_group: +contact.from_group,
            // private_photo: +contact.private_photo,
          },
        })
      })

      display({
        name: 'initialLoad',
        preview: 'MSESAGES create succeeded?',
        value: { messagesArray },
        important: true,
      })
    } else if (msg && !msg.messages) {
      display({
        name: 'initialLoad',
        preview: 'No messages to load',
        important: true,
      })
    }

    return (response = { success: true })
  } catch (e) {
    console.log(`Error at initial load.`)
    console.log(`error: ${e}`)
    display({
      name: 'initialLoad',
      preview: 'error',
      value: { e },
      important: true,
    })
    return {
      success: false,
      error: e,
    }
  }
}
