import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { Contact, Invite } from '../contacts-models'
import { ContactsStore } from '../contacts-store'
import { display, log } from 'lib/logging'

export const updateInvite = async (self: ContactsStore, inv: Invite) => {
  const theseContacts: Contact[] = Array.from(self.contacts.values())
  const inviteContact = theseContacts.find((c) => {
    return c.invite && c.invite.id === inv.id
  })
  if (inviteContact) {
    // TODO: test this
    log('Attempting to updateInvite but may need to do as setter...')
    inviteContact.invite = inv
  }
  const root = getRoot(self) as RootStore
  root.details.getBalance()
}
