import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import { observer } from 'mobx-react-lite'
import { useTheme } from '../../store'

function Header(props) {
  const theme = useTheme()
  return (
    <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg }}>
      <View style={{ ...styles.flex, ...styles.content }}>
        <View style={{ ...styles.flex, ...styles.left }}></View>
        <View style={{ ...styles.flex, ...styles.right }}>
          <TouchableOpacity onPress={props.onEdit}>
            <Text style={{ ...styles.edit, color: theme.primary }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Appbar.Header>
  )
}

export default observer(Header)

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
    // height: 20
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
    marginLeft: 14,
  },
  right: {
    marginRight: 14,
    justifyContent: 'flex-end',
  },
  brand: {
    width: 65,
    height: 65,
    maxWidth: 65,
    marginLeft: 14,
  },
  edit: {
    fontSize: 16,
  },
})
