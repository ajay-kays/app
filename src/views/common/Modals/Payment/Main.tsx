import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'

import { useStores, useTheme } from 'store'
import { useAvatarColor } from '../../../../store/hooks/msg'
import { SCREEN_HEIGHT } from 'lib/constants'
import NumKey from '../../../utils/numkey'
import { usePicSrc } from '../../../utils/picSrc'
import Button from '../../Button'
import Typography from '../../Typography'
import Avatar from '../../Avatar'

export default function Main({ contact, loading, confirmOrContinue, contactless }) {
  const { ui, details } = useStores()
  const theme = useTheme()
  const [amt, setAmt] = useState('0')
  const [text, setText] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  const uri = usePicSrc(contact)
  const hasImg = uri ? true : false

  function go(n) {
    if (amt === '0') setAmt(`${n}`)
    else
      setAmt((prevAmt) => {
        const newAmount = `${amt}${n}`
        if (ui.payMode === 'payment' && details.balance < parseInt(newAmount)) {
          return prevAmt
        }
        return newAmount
      })
  }

  function backspace() {
    if (amt.length === 1) {
      setAmt('0')
    } else {
      const newAmt = amt.substr(0, amt.length - 1)
      setAmt(newAmt)
    }
  }

  const isLoopout = ui.payMode === 'loopout'
  const nameColor = contact && useAvatarColor(contact.alias)
  return (
    <View
      style={{
        ...styles.wrap,
        maxHeight: SCREEN_HEIGHT - 80,
        minHeight: SCREEN_HEIGHT - 80,
        justifyContent: contact ? 'space-around' : 'center',
      }}
    >
      {contact && (
        <View style={styles.contactWrap}>
          <Avatar photo={contact.photo_url} size={40} />
          <View style={styles.contactAliasWrap}>
            <Typography color={theme.subtitle}>
              {ui.payMode === 'invoice' ? 'From' : 'To'}
            </Typography>
            <Typography color={nameColor}>{contact.alias}</Typography>
          </View>
        </View>
      )}

      <View style={styles.amtWrap}>
        <View style={styles.amtInnerWrap}>
          <Typography size={45} lh={50}>
            {amt}
          </Typography>
          <Typography style={{ ...styles.sat }} size={23} color={theme.subtitle}>
            sat
          </Typography>
        </View>
      </View>

      {ui.payMode === 'invoice' && (
        <View style={styles.memoWrap}>
          <TextInput
            value={text}
            placeholder='Add Message'
            onChangeText={(v) => setText(v)}
            style={{ ...styles.input, backgroundColor: theme.bg }}
            underlineColor={theme.border}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
        </View>
      )}
      <NumKey onKeyPress={(v) => go(v)} onBackspace={() => backspace()} squish />
      <View style={styles.confirmWrap}>
        {amt !== '0' && (
          <Button
            w={125}
            loading={loading}
            disabled={loading}
            onPress={() => confirmOrContinue(parseInt(amt), text)}
          >
            {contactless || isLoopout ? 'CONTINUE' : 'CONFIRM'}
          </Button>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%',
  },
  contactWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
  },
  contactAliasWrap: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
  amtWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  amtInnerWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sat: {
    position: 'absolute',
    right: 25,
  },
  confirmWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: 60,
    marginTop: 14,
    marginBottom: isIphoneX() ? getBottomSpace() : 10,
  },
  memoWrap: {
    width: '80%',
    marginLeft: '10%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 14,
  },
  input: {
    height: 50,
    maxHeight: 50,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
})
