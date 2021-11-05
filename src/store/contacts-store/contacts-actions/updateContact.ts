import { ContactsStore } from '../contacts-store'
import { relay } from 'api'
import { normalizeContact } from '../../normalize'
import { display, log } from 'lib/logging'

export const updateContact = async (self: ContactsStore, id: any, v: any) => {
  if (!id) return false
  try {
    const r = await relay?.put(`contacts/${id}`, v)
    const contact = normalizeContact(r)
    if (contact) {
      self.setContact(contact)
      display({
        name: 'updateContact',
        preview: `Updated contact ${contact.alias}`,
        value: contact,
      })
    }
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
