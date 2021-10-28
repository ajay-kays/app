import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Appbar, IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import Toast from 'react-native-simple-toast'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../store'
import * as utils from '../utils/utils'
import Pushable from '../common/Pushable'
import Button from '../common/Button'
import Typography from '../common/Typography'
import DialogWrap from '../common/Dialogs/DialogWrap'

function Header({ onScanClick }) {
  const navigation = useNavigation()
  const { ui, details, user } = useStores()
  const theme = useTheme()
  const [capacityDialog, setCapacityDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const showStatusHandler = () => {
    const status = ui.connected ? 'Connected node' : 'Disconnected node'

    Toast.showWithGravity(status, 0.4, Toast.CENTER)
  }

  async function onCapacityRequest() {
    try {
      setLoading(true)
      const done = await details.requestCapacity(user.publicKey)
      await utils.sleep(300)

      if (done) {
        setRequestSent(true)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg }}>
      <View style={{ ...styles.flex, ...styles.content }}>
        <View style={{ ...styles.flex, ...styles.left }}>
          <Pushable onPress={onScanClick}>
            <IconButton icon='qrcode-scan' size={22} color={theme.icon} />
          </Pushable>
        </View>
        <View style={{ ...styles.flex, ...styles.right }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setCapacityDialog(true)}
            // onPress={() => navigation.navigate('AddSats')}
            activeOpacity={0.6}
          >
            <MaterialIcon name='plus' color={theme.primary} size={20} />
            <Typography style={{ marginLeft: 2 }} size={16} color={theme.primary}>
              Add Capacity
            </Typography>
          </TouchableOpacity>
        </View>

        <DialogWrap
          visible={capacityDialog}
          onDismiss={() => setCapacityDialog(false)}
          // minH={190}
        >
          <Typography textAlign='center' size={17}>
            Request an increase of capacity.
          </Typography>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {requestSent ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                  }}
                >
                  <MaterialIcon name='check' color={theme.green} size={22} />
                  <Typography
                    textAlign='center'
                    size={17}
                    color={theme.title}
                    style={{ marginLeft: 5 }}
                  >
                    Your request has been sent.
                  </Typography>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Button
                    mode='text'
                    size='small'
                    h={40}
                    fs={12}
                    w={100}
                    onPress={() => {
                      setCapacityDialog(false)
                      setRequestSent(false)
                    }}
                    style={{
                      marginTop: 25,
                      // borderWidth: 1,
                      // borderColor: theme.greyPrimary
                    }}
                  >
                    Ok
                  </Button>
                </View>
              </View>
            ) : (
              <Button
                color={theme.darkPrimary}
                // mode='text'
                size='small'
                h={40}
                fs={12}
                loading={loading}
                w={125}
                onPress={onCapacityRequest}
                style={{
                  marginTop: 25,
                  borderWidth: 1,
                  borderColor: theme.greyPrimary,
                }}
              >
                Confirm
              </Button>
            )}
          </View>
        </DialogWrap>
      </View>
    </Appbar.Header>
  )
}

export default observer(Header)

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    justifyContent: 'space-between',
    width: 50,
    marginLeft: 0,
  },
  right: {
    marginRight: 12,
    justifyContent: 'flex-end',
  },
})
