import { RelayStore } from '../relay-store'
import { decode as atob } from 'base-64'

// replace these
const checking = false
const correct = true

export const checkInvite = async (self: RelayStore, theCode: string) => {
  self.setCode(theCode)
  if (!theCode || checking) return

  // const correct = detectCorrectString(theCode)
  if (!correct) return

  // setChecking(true)
  try {
    // atob decodes the code
    const codeString = atob(theCode)
    if (codeString.startsWith('keys::')) {
      // setShowPin(true)
      console.tron.log('Keys, entering PIN...')
      // temp
      self.pinEntered('756712') // pin here
      return
    }
    if (codeString.startsWith('ip::')) {
      console.tron.log('Ready to signupWithIP...')
      // signupWithIP(codeString)
      return
    }
    // user.reportError("Code Component - checkInvite function isn't keys or ip", { code: theCode })
  } catch (e) {
    // user.reportError('Code component - checkInvite function - try catch of checking keys prefix', e)
  }
}
