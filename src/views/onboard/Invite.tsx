import React, { useState } from 'react'
import { Linking, View, StyleSheet, TextInput } from 'react-native'
import { IconButton, ActivityIndicator } from 'react-native-paper'
import RadialGradient from 'react-native-radial-gradient'
import Toast from 'react-native-simple-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useStores, useTheme } from 'store'
import Typography from '../common/Typography'
import Button from '../common/Button'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { navigate } from 'nav'

export default function Invite() {
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(false)
  const [wrong, setWrong] = useState('')
  const [error, setError] = useState<any>('')
  const { user } = useStores()
  const theme = useTheme()

  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async function submitEmail(s) {
    try {
      setChecking(true)

      if (!s) {
        setWrong('Email is required.')
        setTimeout(() => setWrong(''), 10000)
        return
      }

      const isValid = emailIsValid(s)

      if (!isValid) {
        setWrong('Email is invalid. Please try again with a valid email.')
        setTimeout(() => setWrong(''), 10000)
        return
      }

      const done = await user.requestInvite(email)

      if (done?.status !== 'ok') {
        setWrong('Failed to request invitation.')
        return
      }

      if (done?.payload?.duplicate) {
        setEmail('')
        Toast.showWithGravity(`Email already subscribed!`, 5, Toast.BOTTOM)
        return
      }

      setEmail('')
      Toast.showWithGravity(
        `Subscribed! You are the ${done?.payload?.id} number on the list`,
        5,
        Toast.BOTTOM
      )
    } catch (error) {
      setError(error)
    } finally {
      setChecking(false)
      setTimeout(() => setWrong(''), 10000)
    }
  }

  return (
    <View style={styles.wrap} accessibilityLabel='request-invite'>
      <RadialGradient
        style={styles.gradient}
        colors={[theme.gradient, theme.gradient2]}
        stops={[0.1, 1]}
        center={[80, 40]}
        radius={400}
      >
        <IconButton
          icon='arrow-left'
          color={theme.grey}
          size={26}
          style={styles.backArrow}
          onPress={() => navigate('Home')}
          accessibilityLabel='onboard-profile-back'
        />

        <KeyboardAwareScrollView
          contentContainerStyle={{ ...styles.content }}
          scrollEnabled={false}
        >
          <Typography
            style={{
              marginBottom: 10,
            }}
            size={48}
            color={theme.white}
            fw='600'
            lh={48}
          >
            Welcome
          </Typography>

          <TouchableOpacity onPress={() => Linking.openURL('https://shop.getzion.com/')}>
            <Typography
              color={theme.white}
              size={20}
              textAlign='center'
              lh={23}
              style={{
                marginTop: 15,
                maxWidth: 310,
              }}
            >
              We may have nodes available!{' '}
              <Typography color={theme.yellow}>Click here to check the shop.</Typography>
            </Typography>
          </TouchableOpacity>
          <Typography
            color={theme.white}
            size={20}
            textAlign='center'
            lh={29}
            style={{
              marginTop: 15,
              maxWidth: 270,
            }}
          >
            Or enter your email and we will add you to the waitlist.
          </Typography>
          <View style={styles.inputWrap} accessibilityLabel='onboard-code-input-wrap'>
            <TextInput
              autoCorrect={false}
              accessibilityLabel='onboard-code-input'
              placeholder='Enter Email'
              autoCapitalize='none'
              style={{
                ...styles.input,
                backgroundColor: theme.white,
                borderColor: theme.white,
              }}
              placeholderTextColor={theme.greySecondary}
              value={email}
              onChangeText={(text) => setEmail(text)}
              // onBlur={() => submitEmail(email)}
              onFocus={() => {
                if (wrong) setWrong('')
              }}
            />
          </View>
          <Button
            color={theme.primary}
            w={200}
            size='large'
            style={{
              borderWidth: 2,
              borderColor: theme.white,
            }}
            // onPress={submitEmail}
            onPress={() => submitEmail(email)}
            disabled={checking}
          >
            <Typography color={theme.white} fw='700'>
              Subscribe
            </Typography>
          </Button>
          <View style={styles.spinWrap}>
            {checking && <ActivityIndicator animating={true} color={theme.white} />}
          </View>
        </KeyboardAwareScrollView>

        {(wrong ? true : false) && (
          <View
            style={{
              ...styles.message,
              backgroundColor: theme.transparent,
            }}
          >
            <Typography style={{ margin: 24 }} color={theme.white} textAlign='center'>
              {wrong}
            </Typography>
          </View>
        )}
        {(error ? true : false) && (
          <View
            style={{
              ...styles.message,
              backgroundColor: theme.transparent,
            }}
          >
            <Typography
              style={{
                margin: 24,
              }}
              color={theme.white}
              textAlign='center'
            >
              {error}
            </Typography>
          </View>
        )}
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
  backArrow: {
    position: 'absolute',
    left: 15,
    top: 45,
    zIndex: 9000,
  },
  inputWrap: {
    width: 320,
    maxWidth: '90%',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 70,
    borderRadius: 35,
    marginTop: 30,
    fontSize: 21,
    paddingLeft: 30,
    paddingRight: 65,
    marginBottom: 50,
  },
  spinWrap: {
    marginTop: 40,
    height: 20,
  },
  message: {
    position: 'absolute',
    bottom: 32,
    width: '80%',
    left: '10%',
    borderRadius: 10,
  },
})

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
