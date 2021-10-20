import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import { ChatsStore } from '../chats-store'

export const getDefaultTribeServer = (self: ChatsStore) => {
  const server = self.servers.find((s) => s.host === DEFAULT_TRIBE_SERVER)
  if (!server) {
    self.updateServers()
    return self.getDefaultTribeServer()
  }
  return server
}
