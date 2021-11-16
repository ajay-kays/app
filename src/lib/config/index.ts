import { Config } from './type'

const config: Config = {
  host: 'https://hub.n2n2.chat',
  domain: 'zion.chat',
  hub: {
    api: 'https://hub.n2n2.chat/api/v1/',
  },
  shop: {
    api: 'https://shop.getzion.com/api/v1/',
  },
  tribes: {
    server: 'communities.getzion.com',
    uuid: 'YNzR0h_54n6O1zjeKKEM6vSzwO6yq3N-3aYSpAaeZ04C72dYISzw5UQEAeB3nvwVXspEnAFavDaE0o-bmxZiw_2CNpL1',
  },
  memes: {
    server: 'memes.getzion.com',
  },
  auth: {
    server: 'auth.n2n2.chat',
  },
  inviter: {
    key: '03fc010914cd0b9950f128f1e91c83da9d718b688aa86c5ed5b8bbf521a2f41fc1',
  },
  appstore: 'https://apps.apple.com/us/app/zion-create-openly/id1556918256',
}

export const DEFAULT_HOST = config.host
export const DEFAULT_DOMAIN = config.domain
export const DEFAULT_HUB_API = config.hub.api
export const DEFAULT_SHOP_API = config.shop.api
export const DEFAULT_TRIBE_SERVER = config.tribes.server
export const DEFAULT_TRIBE_UUID = config.tribes.uuid
export const DEFAULT_MEME_SERVER = config.memes.server
export const DEFAULT_AUTH_SERVER = config.auth.server
export const INVITER_KEY = config.inviter.key
export const APP_STORE = config.appstore

export default config
