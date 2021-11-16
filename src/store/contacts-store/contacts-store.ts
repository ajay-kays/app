import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { display } from 'lib/logging'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './contacts-actions'
import { Contact, ContactModel, Invite } from './contacts-models'
import { reset } from 'store'

export const ContactsStoreModel = types
  .model('ContactsStore')
  .props({
    contacts: types.optional(types.map(ContactModel), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    addContact: async (v: any): Promise<any> => await actions.addContact(self as ContactsStore, v),
    createInvite: async (nickname: string, welcome_message: string): Promise<any> =>
      await actions.createInvite(self as ContactsStore, nickname, welcome_message),
    createSubscription: async (v: any): Promise<any> => await actions.createSubscription(v),
    deleteContact: async (id: number): Promise<any> =>
      await actions.deleteContact(self as ContactsStore, id),
    deleteSubscription: async (id: number): Promise<any> => await actions.deleteSubscription(id),
    editSubscription: async (id: number, v: any): Promise<any> =>
      await actions.editSubscription(id, v),
    exchangeKeys: async (id: number): Promise<any> => await actions.exchangeKeys(id),
    getContacts: async (): Promise<boolean> => await actions.getContacts(self as ContactsStore),
    getLowestPriceForInvite: async (): Promise<any> => await actions.getLowestPriceForInvite(),
    getSubscriptionForContact: async (id: number): Promise<any> =>
      await actions.getSubscriptionForContact(id),
    payInvite: async (invite_string: string): Promise<any> =>
      await actions.payInvite(self as ContactsStore, invite_string),
    toggleSubscription: async (sid: number, paused: boolean): Promise<any> =>
      await actions.toggleSubscription(sid, paused),
    updateContact: async (id: number, v: any): Promise<boolean> =>
      await actions.updateContact(self as ContactsStore, id, v),
    updateInvite: async (inv: Invite): Promise<any> =>
      await actions.updateInvite(self as ContactsStore, inv),
    uploadProfilePic: async (file: any, params: { [k: string]: any }): Promise<any> =>
      await actions.uploadProfilePic(file, params),
    setContact(contact: Contact) {
      self.contacts.put(contact)
    },
    removeContact(id) {
      self.contacts.delete(id)
    },
    setContacts(contacts: Contact[]) {
      const formattedArray: any[] = []
      contacts.forEach((contact) => {
        formattedArray.push([contact.id, contact])
      })
      self.contacts.merge(formattedArray)
      display({
        name: 'setContacts',
        preview: `Set ${contacts.length} contacts`,
        value: { contacts, formattedArray },
      })
    },
    reset: () => reset(self),
  }))
  .views((self) => ({
    get contactsArray(): Contact[] {
      return Array.from(self.contacts.values()) || []
    },
  }))

type ContactsStoreType = Instance<typeof ContactsStoreModel>
export interface ContactsStore extends ContactsStoreType {}
type ContactsStoreSnapshotType = SnapshotOut<typeof ContactsStoreModel>
export interface ContactsStoreSnapshot extends ContactsStoreSnapshotType {}
export const createContactsStoreDefaultModel = () => types.optional(ContactsStoreModel, {})
