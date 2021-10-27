import { relay } from 'api'
import { ContactsStore } from '../contacts-store'

export const deleteContact = async (self: ContactsStore, id: number) => {
  try {
    await relay?.del(`contacts/${id}`)
    self.contacts.delete(id.toString())
  } catch (e) {
    console.log(e)
  }
}