import { UserStore } from '../user-store'
import { display, log } from 'lib/logging'

export const reportError = async (self: UserStore, label: string, error: any) => {
  try {
    display({
      name: 'reportError',
      preview: `Placeholder - ${label}`,
      value: { error },
    })
    return true
  } catch (e) {
    return false
  }
}
