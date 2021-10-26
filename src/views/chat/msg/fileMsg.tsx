import React from 'react'
import { StyleSheet, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'

// import shared from './sharedStyles'
import { useTheme } from '../../../store'
import Typography from '../../common/Typography'

export default function FileMsg(props) {
  const { filename, uri, type } = props
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap }}>
      <FeatherIcon name='file-text' color={theme.icon} size={27} />
      <Typography style={{ marginLeft: 12, marginRight: 12 }}>{filename || 'file'}</Typography>
      <MaterialCommunityIcon name='download' color={theme.icon} size={24} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
})
