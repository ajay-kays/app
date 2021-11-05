import Bugsnag from '@bugsnag/react-native'

// https://docs.bugsnag.com/platforms/react-native/react-native/reporting-handled-errors/

export const reportError = (e: any) => {
  try {
    Bugsnag.notify(e)
    console.log(e)
    console.log('Notified Bugsnag of error')
  } catch (e2) {
    console.log('Failed notifying Bugsnag')
    console.log('Original error:', e)
    console.log('Bugsnag error:', e2)
  }
}
