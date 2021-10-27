import React from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import QRCode from 'react-native-qrcode-svg'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import { useTheme } from 'store'
import { SCREEN_WIDTH, TOAST_DURATION } from 'lib/constants'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'
import Button from '../Button'
import Empty from '../Empty'
import Typography from '../Typography'
import { reportError } from 'lib/errorHelper'

function PubKey({ visible, close, pubkey }) {
  const theme = useTheme()

  function copy() {
    Clipboard.setString(pubkey)
    Toast.showWithGravity('Public Key Copied.', TOAST_DURATION, Toast.CENTER)
  }

  async function share() {
    try {
      await Share.open({ message: pubkey })
    } catch (e) {
      reportError(e)
    }
  }

  return (
    <ModalWrap onClose={close} visible={visible}>
      <ModalHeader title='Public Key' onClose={close} />

      <View style={styles.wrap}>
        <View
          style={{
            ...styles.content,
          }}
        >
          {pubkey && <QRCode value={pubkey} size={SCREEN_WIDTH / 1.3} />}
          {!pubkey && <Empty text='No Public Address found' h={30} />}
          <Typography color={theme.title} style={{ marginTop: 40 }}>
            {pubkey}
          </Typography>

          {pubkey && (
            <View style={styles.buttonsWrap}>
              <Button onPress={() => share()} w={130}>
                Share
              </Button>
              <Button onPress={() => copy()} w={130}>
                Copy
              </Button>
            </View>
          )}
        </View>
      </View>
    </ModalWrap>
  )
}

export default observer(PubKey)

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
    marginTop: 40,
    marginBottom: isIphoneX() ? getBottomSpace() : 30,
  },
})
