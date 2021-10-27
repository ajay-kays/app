import React from 'react'
import { View, StyleSheet } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '../../store'
import Button from '../common/Button'
import Typography from '../common/Typography'

const circleStyle = (index: number, opacity: number) => ({
  height: 175 + index * 50,
  width: 175 + index * 50,
  borderRadius: (175 + index * 50) / 2,
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
})

type DisconnectProps = {
  onClose: () => void
}

const Disconnect: React.FC<DisconnectProps> = ({ onClose }) => {
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.orange }}>
      <View style={{ ...styles.circle, ...circleStyle(3, 0.1) }}>
        <View style={{ ...styles.circle, ...circleStyle(2, 0.2) }}>
          <View style={{ ...styles.circle, ...circleStyle(1, 0.3) }}>
            <MaterialIcons name='wifi-off' color={theme.white} size={120} />
          </View>
        </View>
      </View>
      <View style={styles.textWrap}>
        <Typography size={22} textAlign='center' color={theme.white} fw='500'>
          No internet connection
        </Typography>
        <Typography size={22} textAlign='center' color={theme.white} fw='500'>
          Please check your internet settings
        </Typography>
      </View>
      <View style={styles.buttonWrap}>
        <Button onPress={onClose} ph={20} fw='600'>
          Close
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    marginTop: 50,
    paddingHorizontal: 15,
  },
  buttonWrap: {
    marginTop: 50,
  },
})

export default Disconnect
