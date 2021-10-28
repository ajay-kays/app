import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { observer } from 'mobx-react-lite'
import Clipboard from '@react-native-community/clipboard'
import Share from 'react-native-share'
import Toast from 'react-native-simple-toast'
import { useStores, useTheme } from '../../store'
import { TOAST_DURATION } from 'lib/constants'
import QRCode from '../utils/qrcode'
import Button from '../common/Button'
import BackHeader from '../common/BackHeader'
import { reportError } from 'lib/errorHelper'

function PubKey() {
  const { user } = useStores()
  const theme = useTheme()

  function copy() {
    Clipboard.setString(user.publicKey)
    Toast.showWithGravity('Public Key Copied.', TOAST_DURATION, Toast.CENTER)
  }

  async function share() {
    try {
      await Share.open({ message: user.publicKey })
    } catch (e) {
      reportError(e)
    }
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.main }}>
      <BackHeader title='Public Key' screen='Settings' />
      <View style={{ ...styles.content, backgroundColor: theme.bg }}>
        <View style={styles.qrWrap}>
          <QRCode value={user.publicKey} size={710} />
        </View>
        <Text style={{ ...styles.pubkeyText, color: theme.title }}>{user.publicKey}</Text>
        <View style={styles.buttonsWrap}>
          <Button style={styles.button} onPress={() => share()}>
            Share
          </Button>
          <Button style={styles.button} onPress={() => copy()}>
            Copy
          </Button>
        </View>
      </View>
    </View>
  )
}

export default observer(PubKey)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    height: 500,
    minHeight: 400,
    maxHeight: 500,
    margin: 20,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 100,
    paddingBottom: 60,
    borderRadius: 20,
  },
  qrWrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pubkeyText: {
    padding: 20,
    width: '100%',
  },
  buttonsWrap: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  button: {
    borderRadius: 23,
    display: 'flex',
    justifyContent: 'center',
    width: 120,
  },
})
