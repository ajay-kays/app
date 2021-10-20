import { ContactsStore } from '../contacts-store'
import { relay } from 'api'
import { normalizeContact } from '../../normalize'
import { display, log } from 'lib/logging'

export const addContact = async (self: ContactsStore, v: any) => {
  if (!v.public_key) {
    console.log('no pub key')
    return
  }
  try {
    const r = await relay?.post('contacts', { ...v, status: 1 })
    const contact = normalizeContact(r)
    self.setContact(contact)
    display({
      name: 'addContact',
      preview: 'Added contact:',
      value: contact,
    })
    return contact
  } catch (e) {
    console.log(e)
    return
  }
}
