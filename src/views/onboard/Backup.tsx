import React from 'react'
import { observer } from 'mobx-react-lite'
import Toast from 'react-native-simple-toast'
import Clipboard from '@react-native-community/clipboard'
import { encode as btoa } from 'base-64'
import { useStores } from 'store'
import { TOAST_DURATION } from 'lib/constants'
import * as rsa from 'lib/crypto/rsa'
import * as e2e from 'lib/crypto/e2e'
import * as utils from '../utils/utils'
import PIN, { userPinCode } from '../utils/pin'
import Slider from '../utils/slider'
import { reportError } from 'lib/errorHelper'

function Backup(props) {
  const { onDone, z, show } = props
  const { user, contacts } = useStores()

  function showError(err) {
    Toast.showWithGravity(err, TOAST_DURATION, Toast.TOP)
  }

  async function exportKeys(pin) {
    try {
      if (!pin) return showError('NO PIN')
      const thePIN = await userPinCode()
      if (pin !== thePIN) return showError('NO USER PIN')

      const priv = await rsa.getPrivateKey()
      if (!priv) return showError('CANT READ PRIVATE KEY')

      const myContactKey = user.contactKey

      const meContact = contacts.contactsArray.find((c) => c.id === user.myid) || {
        contact_key: myContactKey,
      }

      let pub: string | null = myContactKey
      if (!pub) {
        pub = meContact && meContact.contact_key
      }

      if (!pub) return showError('CANT FIND CONTACT KEY')

      const ip = user.currentIP
      if (!ip) return showError('CANT FIND IP')

      const token = user.authToken
      if (!token) return showError('CANT FIND TOKEN')

      if (!priv || !pub || !ip || !token) return showError('MISSING A VAR')

      const str = `${priv}::${pub}::${ip}::${token}`
      const enc = await e2e.encrypt(str, pin)
      const final = btoa(`keys::${enc}`)

      Clipboard.setString(final)
      Toast.showWithGravity('Export Keys Copied.', TOAST_DURATION, Toast.TOP)
    } catch (e) {
      showError((e as any).message || e)
      reportError(e)
    } finally {
      await utils.sleep(500)
      onDone()
    }
  }

  function finish(pin) {
    exportKeys(pin)
  }

  return (
    <Slider z={z} show={show} accessibilityLabel='onboard-PIN'>
      <PIN forceEnterMode={true} onFinish={(pin) => finish(pin)} extraMessage='Backup your keys' />
    </Slider>
  )
}

export default observer(Backup)
