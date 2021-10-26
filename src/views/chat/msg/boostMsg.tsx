import React from 'react'
import { StyleSheet, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useParsedJsonOrClipMsg } from '../../../store/hooks/msg'
import { useTheme } from '../../../store'
import shared from './sharedStyles'
// import CustomIcon from '../../utils/customIcons'
import Typography from '../../common/Typography'

export default function BoostMessage(props) {
  const { message_content } = props
  const theme = useTheme()

  const obj = useParsedJsonOrClipMsg(message_content)
  const { ts, feedID, itemID, amount } = obj

  return (
    <View style={{ ...styles.wrap }}>
      <View style={{ ...styles.rocketWrap, backgroundColor: theme.primary }}>
        {/* <CustomIcon color='white' size={20} name='fireworks' /> */}
        <Ionicon name='rocket-outline' color={theme.white} size={16} />
      </View>
      <Typography color={theme.text} fw='500'>
        {amount}
      </Typography>
      <Typography color={theme.subtitle} style={{ marginLeft: 6 }}>
        sat
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    ...shared.innerPad,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 150,
  },
  rocketWrap: {
    height: 30,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    position: 'absolute',
    right: 6,
    top: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
