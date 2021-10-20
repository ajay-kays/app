import { ChatsStore } from '../chats-store'
import { DEFAULT_TRIBE_SERVER, DEFAULT_TRIBE_UUID } from 'lib/config'

export const joinDefaultTribe = async (self: ChatsStore) => {
  const params = await self.getTribeDetails(DEFAULT_TRIBE_SERVER, DEFAULT_TRIBE_UUID)
  const r = await self.joinTribe({
    name: params.name,
    group_key: params.group_key,
    owner_alias: params.owner_alias,
    owner_pubkey: params.owner_pubkey,
    host: params.host || DEFAULT_TRIBE_SERVER,
    uuid: params.uuid,
    img: params.img,
    amount: params.price_to_join || 0,
    is_private: params.private,
  })
  console.log(r)
  return true
}
