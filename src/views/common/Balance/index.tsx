import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'store'
import Typography from '../Typography'
import Icon from '../Icon'

export default function Balance(props) {
  const { color, style, balance } = props
  const theme = useTheme()

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name='Coins' size={20} />
      <Typography style={{ ...style, color: color, marginLeft: 10 }}>
        {balance}{' '}
        <Typography color={theme.subtitle} fw='500'>
          sat
        </Typography>
      </Typography>
    </View>
  )
}
