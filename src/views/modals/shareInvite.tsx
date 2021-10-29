import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { Button, Portal } from 'react-native-paper'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import QRCode from 'react-native-qrcode-svg'
import { useStores } from 'store'
import { SCREEN_WIDTH, TOAST_DURATION } from 'lib/constants'
import ModalWrap from './modalWrap'
import Header from './modalHeader'
import { reportError } from 'lib/errorHelper'

export default function ShareInviteWrap({ visible }) {
  const { ui } = useStores()

  function close() {
    ui.clearShareInviteModal()
  }

  return (
    <ModalWrap onClose={close} visible={visible}>
      {visible && <ShareInvite close={close} />}
    </ModalWrap>
  )
}

function ShareInvite({ close }) {
  const { ui } = useStores()

  function copy() {
    Clipboard.setString(ui.shareInviteString)
    Toast.showWithGravity('Invite Copied!', TOAST_DURATION, Toast.TOP)
  }

  async function share() {
    try {
      await Share.open({ message: ui.shareInviteString })
    } catch (e) {
      reportError(e)
    }
  }

  const hasInvite = ui.shareInviteString ? true : false

  return useObserver(() => (
    <Portal.Host>
      <Header title='Share Invitation Code' onClose={close} />
      <TouchableWithoutFeedback style={styles.wrap} onPress={copy}>
        <View style={styles.wrap}>
          <View style={styles.tapWrap}>
            <Image
              style={{ height: 29, width: 17 }}
              source={require('../../../android_assets/tap_to_copy.png')}
            />
            <Text style={styles.tapToCopy}>TAP TO COPY</Text>
          </View>
          <View style={styles.qrWrap}>
            {hasInvite && <QRCode value={ui.shareInviteString} size={SCREEN_WIDTH / 1.3} />}
          </View>
          {hasInvite && (
            <View style={styles.inviteStringWrap}>
              <Text style={styles.inviteString}>{ui.shareInviteString}</Text>
            </View>
          )}
          <Button icon='share' onPress={() => share()} style={styles.shareButton}>
            Share
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </Portal.Host>
  ))
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  wrap: {
    flex: 1,
  },
  qrWrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  former: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  tapWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.35,
  },
  tapToCopy: {
    fontSize: 10,
    color: 'black',
    marginLeft: 10,
  },
  shareButton: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
  },
  inviteStringWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inviteString: {
    fontSize: 12,
    color: 'grey',
    marginTop: 20,
  },
})
