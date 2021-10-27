import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

import { useStores, useTheme } from '../../store'
import Slider from '../utils/slider'
import * as rsa from 'lib/crypto/rsa'
import Button from '../common/Button'
import Typography from '../common/Typography'

export default function NameAndKey(props) {
  const { onDone, z, show } = props
  const { contacts, user } = useStores()
  const [updating, setUpdating] = useState(false)
  const [text, setText] = useState('')
  const theme = useTheme()

  const inputRef = useRef<any>(null) // better than any..?

  async function ok() {
    try {
      setUpdating(true)
      const keyPair = await rsa.generateKeyPair()
      await contacts.updateContact(user.myid, {
        alias: text,
        contact_key: keyPair.public,
      })
      user.setAlias(text)
      inputRef?.current?.blur()
      onDone()
      setTimeout(() => {
        setUpdating(false)
      }, 500)
    } catch (error) {
      await user.reportError('NameAndKey component - ok function', error)
    }
  }
  return (
    <Slider
      z={z}
      show={show}
      style={{ backgroundColor: theme.bg }}
      accessibilityLabel='onboard-name'
    >
      <Typography size={24} fw='600' color={theme.dark ? theme.white : theme.black}>
        What's your name?
      </Typography>
      <Typography size={16} fw='600' color={theme.dark ? theme.white : theme.black}>
        You can change this at any time.
      </Typography>
      <TextInput
        value={text}
        ref={inputRef}
        accessibilityLabel='onboard-name-input'
        placeholder='Set Nickname'
        style={{
          ...styles.input,
          backgroundColor: theme.dark ? theme.white : theme.lightGrey,
          borderColor: theme.white,
        }}
        placeholderTextColor={theme.greySecondary}
        onChangeText={(text) => setText(text)}
      />
      <View style={styles.buttonWrap} accessibilityLabel='onboard-name-button-wrap'>
        <Button
          accessibilityLabel='onboard-name-button'
          loading={updating}
          onPress={ok}
          disabled={!text}
          style={{ ...styles.button }}
          color={theme.primary}
          w={150}
          size='large'
        >
          <Typography color={text ? theme.white : theme.black}>Next</Typography>
        </Button>
      </View>
    </Slider>
  )
}

const styles = StyleSheet.create({
  buttonWrap: {
    position: 'absolute',
    bottom: 42,
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  button: {
    marginRight: '12.5%',
  },
  input: {
    width: '75%',
    height: 70,
    borderRadius: 35,
    marginTop: 30,
    fontSize: 21,
    paddingLeft: 25,
    paddingRight: 25,
    marginLeft: '12.5%',
    marginRight: '12.5%',
    marginBottom: 100,
  },
})
