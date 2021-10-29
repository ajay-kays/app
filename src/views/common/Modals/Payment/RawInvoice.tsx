import React from 'react'
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import QRCode from 'react-native-qrcode-svg'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'

import { useTheme } from 'store'
import { SCREEN_WIDTH, TOAST_DURATION } from 'lib/constants'
import ModalWrap from '../ModalWrap'
import ModalHeader from '../ModalHeader'
// import QRCode from '../../../utils/qrcode'
import Button from '../../Button'
import Typography from '../../Typography'
import { reportError } from 'lib/errorHelper'

export default function RawInvoice({ visible, onClose, amount, payreq, paid }) {
  const theme = useTheme()

  function copy() {
    Clipboard.setString(payreq)
    Toast.showWithGravity('Payment Request Copied', TOAST_DURATION, Toast.CENTER)
  }

  async function share() {
    try {
      await Share.open({ message: payreq })
    } catch (e) {
      reportError(e)
    }
  }

  return (
    <ModalWrap
      visible={visible}
      nopad
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      swipeDirection='right'
      hasBackdrop={false}
    >
      <ModalHeader title='Payment Request' onClose={onClose} />
      <View style={{ ...styles.wrap }}>
        <View
          style={{
            ...styles.content,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            {amount && (
              <Typography size={16} color={theme.title} style={{ marginBottom: 20 }}>
                {`Amount:  ${amount}`}
                <Typography color={theme.subtitle}>{` sats`}</Typography>
              </Typography>
            )}
            <View style={{ position: 'relative' }}>
              <QRCode value={payreq} size={SCREEN_WIDTH / 1.2} />
              {paid && (
                <View style={styles.paidWrap}>
                  <Typography
                    style={styles.paid}
                    color='#55D1A9'
                    fw='500'
                    bg={theme.white}
                    textAlign='center'
                    lh={30}
                  >
                    PAID
                  </Typography>
                </View>
              )}
            </View>
            <Typography
              size={14}
              color={theme.title}
              numberOfLines={4}
              style={{
                marginTop: 20,
              }}
            >
              {payreq}
            </Typography>
          </View>
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

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    width: SCREEN_WIDTH / 1.2,
  },
  buttonsWrap: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 40,
    marginBottom: isIphoneX() ? getBottomSpace() : 30,
  },
  paidWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  paid: {
    borderWidth: 4,
    height: 41,
    width: 80,
    borderColor: '#55D1A9',
  },
})
