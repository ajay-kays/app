import React from 'react'
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native'
import { AesCryptorTest } from './AesCryptorTest'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, height: 800 }}>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        style={{ flex: 1, backgroundColor: 'black' }}
      >
        <AesCryptorTest />
      </ScrollView>
    </SafeAreaView>
  )
}

export default App
