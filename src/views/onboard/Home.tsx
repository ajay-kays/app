import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'store'
import Typography from '../common/Typography'
import Button from '../common/Button'
import { navigate } from 'nav'

export default function Home() {
  const theme = useTheme()
  const navigation = useNavigation()

  return (
    <View style={{ ...styles.wrap }} accessibilityLabel='onboard-code'>
      <RadialGradient
        style={styles.gradient}
        colors={[theme.orange, theme.orangeSecondary]}
        stops={[0.1, 1]}
        center={[80, 40]}
        radius={400}
      >
        <View style={styles.content}>
          <View
            style={{
              ...styles.imageWrapper,
              backgroundColor: theme.transparent,
            }}
          >
            <Image
              source={require('../../assets/zion-dark-theme.png')}
              style={{ width: 140, height: 100 }}
              resizeMode={'contain'}
            />
          </View>

          <Button
            color={theme.orangeSecondary}
            w='70%'
            size='large'
            style={{
              borderWidth: 2,
              borderColor: theme.white,
            }}
            onPress={() => navigate('Invite')}
          >
            <Typography color={theme.white} fw='700'>
              Subscribe to the waitlist
            </Typography>
          </Button>
          <Button
            fw='500'
            color={theme.lightGrey}
            w='70%'
            style={{ marginTop: 15 }}
            onPress={() => navigate('Onboard', { codeType: 'invite' })}
          >
            Enter access key
          </Button>
          <Button
            fw='500'
            color={theme.lightGrey}
            w='70%'
            style={{ marginTop: 15 }}
            onPress={() => navigate('Onboard', { codeType: 'backup' })}
          >
            Enter backup key
          </Button>
        </View>
      </RadialGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  imageWrapper: {
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 45,
  },
})
