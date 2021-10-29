import React from 'react'
import { View } from 'react-native'
import Typography from '../../common/Typography'
import styles from './styles'

type HeaderProps = {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <View style={styles.header}>
      <Typography size={22} textAlign='center'>
        Rumble embed or Youtube url
      </Typography>
    </View>
  )
}

export default Header
