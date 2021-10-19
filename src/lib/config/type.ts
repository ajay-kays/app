export type Config = {
  host: string
  domain: string
  hub: {
    api: string
  }
  shop: {
    api: string
  }
  tribes: {
    server: string
    uuid: string
  }
  memes: {
    server: string
  }
  auth: {
    server: string
  }
  inviter: {
    key: string
  }
  appstore: string
}
