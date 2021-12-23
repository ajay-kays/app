import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useTheme } from 'store'
import Typography from '../Typography'
import { navigate } from 'nav'

export default function BackHeader({ title, screen, action, border, navigate, backDisabled = false }) {
  const theme = useTheme()
  const navigation = useNavigation()

  function onBack() {
    navigation.goBack()
    // requestAnimationFrame(() => {
    //   if (navigate) {
    //     return navigate()
    //   }

    //   navigation.navigate(screen)
    // })
  }

  return (
    <Appbar.Header
      style={{
        ...styles.appBar,
        backgroundColor: theme.bg,
        borderBottomColor: theme.border,
        borderBottomWidth: border ? 1 : 0,
      }}
    >
      {!backDisabled && <TouchableOpacity onPress={onBack} style={{ ...styles.left }}>
        <FeatherIcon name='chevron-left' size={28} color={theme.icon} />
      </TouchableOpacity>}
      <View>
        <Typography color={theme.text} size={16} fw='500'>
          {title}
        </Typography>
      </View>

      {action && <View style={{ ...styles.right }}>{action}</View>}
    </Appbar.Header>
  )
}

BackHeader.defaultProps = {
  screen: 'Account',
  action: null,
  navigate: null,
  title: '',
  border: false,
}

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 60,
  },
  left: {
    position: 'absolute',
    left: 10,
  },
  right: {
    position: 'absolute',
    right: 10,
  },
})
