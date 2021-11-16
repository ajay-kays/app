import React from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View } from 'react-native'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import QRCode from 'react-native-qrcode-svg'

import { useStores } from '../../../store'
import { DEFAULT_DOMAIN } from 'lib/config'
import { SCREEN_WIDTH, TOAST_DURATION } from 'lib/constants'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'
import Button from '../Button'
import { reportError } from 'lib/errorHelper'

function ShareGroup() {
  const { ui, chats } = useStores()

  const uuid = ui.shareCommunityUUID
  const host = chats.getDefaultTribeServer().host

  const qr = `${DEFAULT_DOMAIN}://?action=tribe&uuid=${uuid}&host=${host}`

  function copy() {
    Clipboard.setString(qr)
    Toast.showWithGravity('Community QR Copied!', TOAST_DURATION, Toast.TOP)
  }

  async function share() {
    try {
      await Share.open({ message: qr })
    } catch (e) {
      reportError(e)
    }
  }

  function close() {
    ui.setShareCommunityUUID(null)
  }

  return (
    <ModalWrap visible={ui.shareCommunityUUID ? true : false} onClose={close}>
      <ModalHeader title='Community QR Code' onClose={close} />
      <View style={styles.wrap}>
        <View
          style={{
            ...styles.content,
          }}
        >
          <QRCode value={qr} size={SCREEN_WIDTH / 1.3} />
          {/* <Typography color={theme.subtitle}>{qr}</Typography> */}
          <View style={styles.buttonsWrap}>
            <Button onPress={() => share()} w={130}>
              Share
            </Button>
            <Button onPress={() => copy()} w={130}>
              Copy
            </Button>
          </View>
        </View>
      </View>
    </ModalWrap>
  )
}

export default observer(ShareGroup)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginTop: 40,
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    width: SCREEN_WIDTH / 1.3,
  },
  buttonsWrap: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 40,
    // marginBottom: isIphoneX() ? getBottomSpace() : 30
  },
})
