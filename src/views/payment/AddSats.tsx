import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { TextInput } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import { useStores, useTheme } from 'store'
import { TOAST_DURATION } from 'lib/constants'
import BackHeader from '../common/BackHeader'
import Button from '../common/Button'

const apps = [
  {
    name: 'cash',
    label: 'Cash App',
    url: 'https://cash.app/$',
    img: require('../../assets/cash.png'),
  },
]

function AddSats() {
  const [selectedApp, setSelectedApp] = useState(null)
  const theme = useTheme()

  function selectApp(a) {
    setSelectedApp(a)
  }

  return (
    <>
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader title='Add Sats' screen='Payment' />
        <View style={styles.content}>
          {!selectedApp && (
            <>
              {apps.map((app) => {
                return (
                  <TouchableOpacity
                    key={app.name}
                    style={{
                      ...styles.appWrap,
                      borderColor: theme.border,
                      backgroundColor: theme.main,
                    }}
                    onPress={() => selectApp(app)}
                  >
                    <FastImage
                      source={app.img}
                      style={{ height: 48, width: 48, marginRight: 12 }}
                    />
                    <Text style={{ ...styles.appLabel, color: theme.title }}>{app.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </>
          )}
          {selectedApp && <Do app={selectedApp} />}
        </View>
      </View>
    </>
  )
}

export default observer(AddSats)

function Do({ app }) {
  const { name, label, url, img } = app
  const { ui } = useStores() // queries
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [addy, setAddy] = useState('')
  const [err, setErr] = useState('')
  const [spd, setSpd] = useState(5000)
  const [canLink, setCanLink] = useState(false)

  async function gen() {
    setLoading(true)
    console.log('get onchain address for', name)
    // const addy = await queries.onchainAddress(name)
    const addy = '87865yunhbgvfdxcgvhbjnkjbhgvfcgvhb'

    if (!addy) {
      return setErr('Could not generate address')
    }

    setLoading(false)
    setAddy(addy)
  }

  async function getExchangeRate() {
    throw 'sats per dollar query unimplemented'
    // const spd = await queries.satsPerDollar()
  }

  useEffect(() => {
    gen()
    getExchangeRate()
  }, [])

  function openLink() {
    Linking.openURL(url)
  }

  function copyAddy() {
    Clipboard.setString(addy)
    Toast.showWithGravity('Address Copied!', TOAST_DURATION, Toast.CENTER)

    setCanLink(true)
  }

  return (
    <View style={styles.do}>
      {/* <View style={styles.buttonWrap}>
        <Button onPress={gen} mode='contained' dark={true} style={styles.addButton} loading={loading}>
          Get Onchain Address
        </Button>
      </View> */}
      <View style={styles.stuffWrap}>
        <Text style={{ color: theme.text, marginBottom: 8 }}>Address</Text>
        <TextInput
          autoCompleteType='off'
          placeholder='Bitcoin Address'
          value={addy}
          editable={false}
          style={{ ...styles.addressInput, backgroundColor: theme.main }}
          underlineColor={theme.border}
        />
        <Button mode='text' onPress={copyAddy} disabled={!addy ? true : false} loading={loading}>
          Tap to Copy
        </Button>
        <View style={styles.pleaseWrap}>
          <Text style={{ color: theme.subtitle }}>
            Please send between 0.0005 and 0.005 Bitcoin. After the transaction is confirmed, it
            will be added to your account.
          </Text>
        </View>
      </View>

      <View style={{ ...styles.bottom }}>
        <TouchableOpacity
          style={{ ...styles.linkWrap, opacity: canLink ? 1 : 0.5 }}
          onPress={openLink}
          disabled={!canLink}
        >
          <FastImage source={img} style={{ height: 48, width: 48, marginRight: 12 }} />
          <Text style={{ ...styles.appLabel, color: theme.title }}>{`Open ${label} ➞`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 40,
  },
  appsWrap: {
    display: 'flex',
    padding: 12,
  },
  appWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    width: '100%',
    marginBottom: 12,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 10,
    paddingLeft: 10,
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#6289FD',
    borderRadius: 30,
    width: '75%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 28,
  },
  appLabel: {
    fontSize: 18,
  },
  do: {
    flex: 1,
    width: '100%',
    paddingLeft: 14,
    paddingRight: 14,
  },
  bottom: {
    flex: 1,
    marginTop: 40,
    paddingRight: 14,
    paddingLeft: 14,
    justifyContent: 'flex-end',
  },
  stuffWrap: {
    flex: 1,
  },
  addressInput: {
    marginBottom: 18,
    height: 50,
    borderBottomWidth: 0,
  },
  pleaseWrap: {
    marginTop: 18,
  },
  linkWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
    paddingTop: 20,
    paddingBottom: 20,
  },
})
