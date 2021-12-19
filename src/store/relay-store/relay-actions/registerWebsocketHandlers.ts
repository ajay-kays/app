import { registerWsHandlers } from 'api/ws'
import { display, log } from 'lib/logging'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { normalizeContact } from 'store/normalize'
import { RelayStore } from 'store/relay-store'

export const registerWebsocketHandlers = async (self: RelayStore) => {
  const root = getRoot(self) as RootStore
  const chatStore = root.chats
  const contactStore = root.contacts
  const msgStore = root.msg
  const uiStore = root.ui
  const userStore = root.user

  const handlers = {
    attachment: (data) => {
      display({
        name: '[ws] attachment',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    boost: (data) => {
      display({
        name: '[ws] boost',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    bot_res: (data) => {
      display({
        name: '[ws] bot_res',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    cancellation: (data) => {
      display({
        name: '[ws] cancellation',
        value: { data },
        important: true,
      })
    },

    chat_seen: (data) => {
      display({
        name: '[ws] chat_seen',
        value: { data },
        important: true,
      })
    },

    confirmation: (data) => {
      display({
        name: '[ws] confirmation',
        value: { data },
        important: true,
      })
      msgStore.setMessageAsReceived(data.response)
    },

    contact: (data) => {
      display({
        name: '[ws] contact',
        value: { data },
        important: true,
      })
      const normalizedContact = normalizeContact(data.response)
      if (normalizedContact) {
        contactStore.setContact(normalizedContact)
      }
    },

    deleteMessage: (data) => {
      display({
        name: '[ws] deleteMessage',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    direct_payment: (data) => {
      display({
        name: '[ws] direct_payment',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    errorAuth: (data) => {
      display({
        name: '[ws] ERROR AUTH',
        value: { data },
        important: true,
      })
      userStore.logout()
    },

    group_create: (data) => {
      display({
        name: '[ws] group_create',
        value: { data },
        important: true,
      })
      chatStore.gotChat(data.response.chat)
    },

    group_join: (data) => {
      display({
        name: '[ws] group_join',
        value: { data },
        important: true,
      })
      const msg = data.response?.message
      if (msg && data.response.chat) {
        msg.chat = data.response.chat
        msgStore.gotNewMessageFromWS(msg)
      }
    },

    group_leave: (data) => {
      display({
        name: '[ws] group_leave',
        value: { data },
        important: true,
      })
      const msg = data.response?.message
      if (msg && data.response.chat) {
        msg.chat = data.response.chat
        msgStore.gotNewMessageFromWS(msg)
      }
    },

    keysend: (data) => {
      display({
        name: '[ws] keysend',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    member_approve: (data) => {
      display({
        name: '[ws] member_approve',
        value: { data },
        important: true,
      })
      if (!data.response.message) return
      msgStore.gotNewMessageFromWS(data.response.message)
    },

    member_reject: (data) => {
      display({
        name: '[ws] member_reject',
        value: { data },
        important: true,
      })
      if (!data.response.message) return
      msgStore.gotNewMessageFromWS(data.response.message)
    },

    member_request: (data) => {
      display({
        name: '[ws] member_request',
        value: { data },
        important: true,
      })
      if (!data.response.message) return
      msgStore.gotNewMessageFromWS(data.response.message)
    },

    message: (data) => {
      display({
        name: '[ws] message',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    invite: (data) => {
      display({
        name: '[ws] invite',
        value: { data },
        important: true,
      })
      contactStore.updateInvite(data.response)
    },

    invoice: (data) => {
      display({
        name: '[ws] invoice',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    invoice_payment: (data) => {
      display({
        name: '[ws] invoice_payment',
        value: { data },
        important: true,
      })
      if (data.response?.invoice) {
        uiStore.setLastPaidInvoice(data.response.invoice)
      }
    },

    payment: (data) => {
      display({
        name: '[ws] payment',
        value: { data },
        important: true,
      })
      msgStore.invoicePaid(data.response)
    },

    purchase: (data) => {
      display({
        name: '[ws] purchase',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    purchase_accept: (data) => {
      display({
        name: '[ws] purchase_accept',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },

    purchase_deny: (data) => {
      display({
        name: '[ws] purchase_deny',
        value: { data },
        important: true,
      })
      msgStore.gotNewMessageFromWS(data.response)
    },
  }

  registerWsHandlers(handlers)

  return true
}
