import React, { useState } from 'react'
import { StyleSheet, View, Image, Linking } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useTheme } from 'store'
import { APP_STORE } from 'lib/config'
import DialogWrap from '../Dialogs/DialogWrap'
import Typography from '../Typography'
import Button from '../Button'
import BackupKeys from '../Modals/BackupKeys'
import { setTint } from '../StatusBar'

function AppVersionUpdate({ visible, close }) {
  const theme = useTheme()
  const [backupVisible, setBackupVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)
  return (
    <DialogWrap
      visible={visible}
      onDismiss={close}
      minH={450}
      round={20}
      dismissable={false}
      ph={0}
    >
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Image
          source={
            theme.dark
              ? require('../../../assets/zion-dark-theme.png')
              : require('../../../assets/zion.png')
          }
          style={{ width: 120, height: 120 }}
          resizeMode={'contain'}
        />
        <View style={styles.content}>
          <Typography size={15} textAlign='center'>
            Your app version is outdated. Please update!
          </Typography>
          <Typography color={theme.subtitle} textAlign='center' style={{ marginTop: 20 }}>
            Please backup your keys before updating the app.
          </Typography>
        </View>

        <View style={styles.buttonWrap}>
          {updateVisible ? (
            <View>
              <Button
                size='small'
                w={170}
                h={40}
                onPress={() => {
                  Linking.openURL(APP_STORE)
                }}
                accessibilityLabel='app-version-ok-button'
              >
                Update Zion
              </Button>
              {/* <Button
                mode='text'
                style={{ marginTop: 20 }}
                size='small'
                w={170}
                h={40}
                onPress={() => {
                  close()
                }}
                accessibilityLabel='app-version-cancel-button'
              >
                Cancel
              </Button> */}
            </View>
          ) : (
            <Button
              w='65%'
              onPress={() => {
                setBackupVisible(true)
                setTimeout(() => {
                  setTint('dark')
                }, 200)
              }}
              accessibilityLabel='app-version-ok-button'
            >
              Backup My Keys
            </Button>
          )}
        </View>
      </View>

      <BackupKeys
        visible={backupVisible}
        close={() => {
          setUpdateVisible(true)
          setBackupVisible(false)
          setTint(theme.dark ? 'dark' : 'light')
        }}
      />
    </DialogWrap>
  )
}

export default observer(AppVersionUpdate)

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 40,
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 40,
  },
})
