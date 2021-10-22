import { ChatsStore } from '../chats-store'
import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { normalizeChat } from 'store/normalize'
import { display, log } from 'lib/logging'

export const joinTribe = async (
  self: ChatsStore,
  {
    name,
    uuid,
    group_key,
    host,
    amount,
    img,
    owner_alias,
    owner_pubkey,
    is_private,
    my_alias,
    my_photo_url,
  }: JoinTribeParams
) => {
  const params = {
    name,
    uuid,
    group_key,
    amount,
    host,
    img,
    owner_alias,
    owner_pubkey,
    private: is_private,
    my_alias: my_alias || '',
    my_photo_url: my_photo_url || '',
  }

  display({
    name: 'joinTribe',
    preview: 'Attempting to join tribe with params:',
    value: params,
  })

  const root = getRoot(self) as RootStore
  try {
    const r = await relay?.post('tribe', params)
    if (!r) return
    const chat = normalizeChat(r)
    if (chat) {
      self.gotChat(chat)
      if (amount) root.details.addToBalance(amount * -1)
    }
    return r
  } catch (e) {
    console.log(e)
  }
}

export type JoinTribeParams = {
  name: string
  uuid: string
  group_key: string
  host: string
  amount: number
  img: string
  owner_alias: string
  owner_pubkey: string
  is_private: boolean
  my_alias?: string
  my_photo_url?: string
  owner_route_hint?: string // CD - made this optional
}
