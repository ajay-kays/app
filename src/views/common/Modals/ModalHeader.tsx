import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useTheme } from 'store'
import Icon from '../Icon'

export default function ModalHeader(props) {
  const { bg, style, title, onClose, leftArrow } = props
  const theme = useTheme()
  return (
    <Appbar.Header
      style={{
        ...styles.appBar,
        backgroundColor: bg ? bg : theme.bg,
        borderBottomColor: theme.border,
      }}
    >
      <TouchableOpacity onPress={onClose} style={{ ...styles.left, ...style }}>
        {leftArrow && <Icon name='ChevronLeft' size={28} color={theme.icon} />}
      </TouchableOpacity>
      <View>
        <Text style={{ ...styles.title, color: theme.text }}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={{ ...styles.right }}>
        {!leftArrow && <Icon name='Close' size={23} color={theme.icon} />}
      </TouchableOpacity>
    </Appbar.Header>
  )
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
    right: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
  },
})
