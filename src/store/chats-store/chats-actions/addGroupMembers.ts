import { relay } from 'api'

export const addGroupMembers = async (chatID: number, contact_ids: number[]) => {
  await relay?.put(`chat/${chatID}`, {
    contact_ids,
  })
  // TODO: Let's confirm we don't need to make any changes to store here...
}
