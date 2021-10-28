import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Appbar, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-simple-toast'
import { useStores, useTheme } from 'store'
import Balance from '../Balance'

function Header({ border = false }) {
  const navigation = useNavigation()
  const { details, ui } = useStores()
  const theme = useTheme()

  const showStatusHandler = () => {
    const status = ui.connected ? 'Connected node' : 'Disconnected node'

    Toast.showWithGravity(status, 0.4, Toast.CENTER)
  }

  return (
    <Appbar.Header
      style={{
        ...styles.appBar,
        backgroundColor: theme.bg,
        borderBottomWidth: border ? 1 : 0,
        borderBottomColor: theme.border,
      }}
    >
      <View style={{ ...styles.flex, ...styles.content }}>
        <View style={{ ...styles.flex, ...styles.left }}>
          <Image
            source={
              theme.dark
                ? require('../../../assets/zion-dark-theme.png')
                : require('../../../assets/zion.png')
            }
            style={styles.brand}
            resizeMode={'contain'}
          />
        </View>
        <Balance balance={details.fullBalance} color={theme.dark ? theme.white : theme.black} />
        <View style={{ ...styles.flex, ...styles.right }}>
          {ui.loadingHistory ? (
            <ActivityIndicator animating={true} color={theme.grey} size={18} style={{}} />
          ) : (
            <TouchableOpacity onPress={showStatusHandler} style={{ ...styles.status }}>
              <MaterialIcon
                name='lightning-bolt'
                size={20}
                color={ui.connected ? '#49ca97' : '#febd59'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Appbar.Header>
  )
}

export default observer(Header)

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
    height: 60,
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
    marginLeft: 12,
  },
  right: {
    justifyContent: 'flex-end',
    marginRight: 12,
  },
  brand: {
    width: 70,
    height: 70,
    maxWidth: 70,
  },
  status: {
    width: 20,
  },
})
