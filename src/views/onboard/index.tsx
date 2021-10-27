import React from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useStores } from 'store'
import Code from './code'
import Welcome from './welcome'
import NameAndKey from './nameAndKey'
import Ready from './ready'
import PIN from './choosePIN'
import ProfilePic from './profilePic'
import SuggestToUserToBackupTheirKeys from './suggestToUserToBackupTheirKeys'
// TODO: remove this lien import Backup from './Backup'

const steps = [
  Code, // scan or enter code, create ip (from invite server), create auth_token in Relay
  Welcome, // create inviter contact (relay)
  PIN, // set pin
  NameAndKey, // set my nickname (and RSA pubkey!)
  SuggestToUserToBackupTheirKeys, // Presents a a video saying to user backup their keys
  ProfilePic, // SuggestToUserToBackupTheirKeys
  Ready, // set my profile pic
]

const OnBoard = observer(() => {
  const { ui, user } = useStores()

  let step = user.onboardStep

  function stepForward() {
    if (step >= steps.length - 1) {
      onFinish()
    } else {
      user.setOnboardStep(step + 1)
    }
  }
  function stepBack() {
    user.setOnboardStep(step - 1)
  }

  function onFinish() {
    user.finishOnboard() // clear out things
    ui.setSignedUp(true) // signed up w key export
    ui.setPinCodeModal(true) // also PIN has been set
  }

  return (
    <View style={styles.wrap} accessibilityLabel='onboard-wrap'>
      {steps.map((C, i) => {
        const render = i === step - 1 || i === step || i === step + 1
        if (!render) return <View key={i} />
        return (
          <C
            key={i}
            z={i}
            show={step > i - 1}
            isTheMainRender={step === i}
            onDone={stepForward}
            onBack={stepBack}
            onRestore={onFinish}
          />
        )
      })}
    </View>
  )
})

const styles = StyleSheet.create({
  wrap: { flex: 1 },
})
export default OnBoard
