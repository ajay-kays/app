import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton, TextInput } from 'react-native-paper'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useTheme } from '../../../store'
import { SCREEN_HEIGHT, TOAST_DURATION } from 'lib/constants'
import QR from '../../common/Accessories/QR'
import PublicKey from '../../common/Modals/PublicKey'
import Typography from '../../common/Typography'

export default function QrInput({
  name,
  label,
  required,
  handleChange,
  handleBlur,
  setValue,
  value,
  displayOnly,
  accessibilityLabel,
}) {
  const theme = useTheme()

  const [scanning, setScanning] = useState(false)
  function scan(data) {
    setValue(data)
    setScanning(false)
  }

  let lab = `${label.en}${required ? ' *' : ''}`
  if (displayOnly) lab = label.en

  function copyAddress(value) {
    Clipboard.setString(value)
    Toast.showWithGravity('Address copid to clipboard', TOAST_DURATION, Toast.CENTER)
  }

  return (
    <>
      <Typography style={{ marginBottom: 16 }} size={14} color={theme.title}>
        {lab}
      </Typography>
      {displayOnly ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {value ? (
              <>
                <Typography
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    paddingRight: 5,
                  }}
                >
                  {value}
                </Typography>
                <IconButton
                  icon='qrcode'
                  color={theme.primary}
                  size={26}
                  onPress={() => setScanning(true)}
                />
              </>
            ) : (
              <Typography color={theme.subtitle}>No Public key found.</Typography>
            )}
          </View>
          {value && (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
                marginBottom: 25,
              }}
            />
          )}
        </>
      ) : (
        <View>
          <TextInput
            autoCompleteType='off'
            accessibilityLabel={accessibilityLabel}
            onChangeText={handleChange(name)}
            onBlur={handleBlur(name)}
            value={value}
            style={{ ...styles.input, backgroundColor: theme.bg }}
            underlineColor={theme.border}
          />

          <IconButton
            icon='qrcode-scan'
            color={theme.primary}
            size={24}
            style={{ ...styles.icon }}
            onPress={() => setScanning(true)}
          />
        </View>
      )}

      <QR
        scannerH={SCREEN_HEIGHT - 60}
        visible={scanning && !displayOnly}
        onCancel={() => setScanning(false)}
        onScan={(data) => scan(data)}
        showPaster={false}
      />

      <PublicKey
        visible={scanning && displayOnly}
        pubkey={value}
        close={() => setScanning(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  inputWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 26,
    width: '100%',
  },
  input: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: 50,
    paddingRight: 40,
    textAlign: 'auto',
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
})
