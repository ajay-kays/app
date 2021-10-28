import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { useStores, useTheme } from '../../store'
import BackHeader from '../common/BackHeader'
import InputAccessoryView from '../common/Accessories/InputAccessoryView'
import Typography from '../common/Typography'

export default function Network() {
  const [serverURL, setServerURL] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useStores()
  const theme = useTheme()
  const nativeID = 'serverUrl'

  useEffect(() => {
    setServerURL(user.currentIP)
  }, [])

  function serverURLchange(URL) {
    setServerURL(URL)
  }

  function saveServerURL() {
    setLoading(true)
    user.setCurrentIP(serverURL)
    setLoading(false)
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Network' />
      <View style={styles.content}>
        <Typography>Server URL</Typography>
        <TextInput
          inputAccessoryViewID={nativeID}
          placeholder='Server URL'
          value={serverURL}
          onChangeText={serverURLchange}
          style={{ height: 50, textAlign: 'auto', backgroundColor: theme.bg }}
          placeholderTextColor={theme.placeholder}
          underlineColor={theme.border}
        />

        <InputAccessoryView nativeID={nativeID} done={saveServerURL} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    marginTop: 40,
    paddingRight: 18,
    paddingLeft: 18,
  },
})
