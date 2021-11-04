import React, { useEffect, useState } from 'react'
import { is24HourFormat } from 'react-native-device-time-format'
import { useDarkMode } from 'react-native-dynamic'
import { Provider as PaperProvider } from 'react-native-paper'
import { Host } from 'react-native-portalize'
import { observer } from 'mobx-react-lite'
import { instantiateRelay } from 'api'
import EE, { RESET_IP_FINISHED } from 'lib/ee'
import useConnectionInfo from 'lib/useConnectionInfo'
import { AuthNavigator } from 'nav'
import { useStores } from 'store'
import { paperTheme } from 'theme'
import Splash from 'views/common/Splash'
import PinCodeModal from 'views/common/Modals/PinCode'
import Disconnect from 'views/disconnect'
import PIN, { wasEnteredRecently } from 'views/utils/pin'
import * as utils from 'views/utils/utils'
import Main from './main'

// This is the first component where we can assume an initialized rootStore.
const RootComponentFC = () => {
  const { theme, user, ui } = useStores()
  const [loading, setLoading] = useState(true)
  const [showDisconnectUI, setShowDisconnectedUI] = useState(true)

  function connectedHandler() {
    ui.setConnected(true)
  }
  function disconnectedHandler() {
    ui.setConnected(false)
  }
  async function check24Hour() {
    const is24Hour = await is24HourFormat()
    ui.setIs24HourFormat(is24Hour)
  }
  const isDarkMode = useDarkMode()

  useEffect(() => {
    if (theme.mode === 'System') {
      theme.setDark(isDarkMode)
    } else {
      theme.setDark(theme.mode === 'Dark')
    }
    check24Hour()
    ;(async () => {
      const isSignedUp = user.currentIP && user.authToken && !user.onboardStep ? true : false

      ui.setSignedUp(isSignedUp)

      if (isSignedUp) {
        instantiateRelay(
          user.currentIP,
          user.authToken,
          connectedHandler,
          disconnectedHandler,
          resetIP
        )
      }
      const pinWasEnteredRecently = await wasEnteredRecently()

      if (pinWasEnteredRecently) ui.setPinCodeModal(true)

      setLoading(false)
    })()
  }, [])

  async function resetIP() {
    ui.setLoadingHistory(true)
    const newIP = await user.resetIP()
    instantiateRelay(newIP, user.authToken, connectedHandler, disconnectedHandler)
    EE.emit(RESET_IP_FINISHED)
  }

  const isConnected = useConnectionInfo()

  if (!isConnected && showDisconnectUI)
    return <Disconnect onClose={() => setShowDisconnectedUI(false)} />
  if (loading) return <Splash />
  if (ui.signedUp && !ui.pinCodeModal) {
    return (
      <PinCodeModal visible={true}>
        <PIN
          onFinish={async () => {
            await utils.sleep(240)
            ui.setPinCodeModal(true)
          }}
        />
      </PinCodeModal>
    )
  }

  const pTheme = paperTheme(theme)

  return (
    <PaperProvider theme={pTheme}>
      <Host>
        {ui.signedUp && (
          // <APNManager>
          <Main />
          // </APNManager>
        )}
        {!ui.signedUp && <AuthNavigator />}
      </Host>
    </PaperProvider>
  )
}

export const RootComponent = observer(RootComponentFC)
