import React, { useEffect } from 'react'
import { Button, Text, View } from 'react-native'
import { skipLogin } from 'dev/skipLogin'

const App = () => {
  useEffect(() => {
    skipLogin()
  }, [])
  return (
    <View
      style={{ flex: 1, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ color: 'white', marginBottom: 30, fontSize: 24 }}>Zion</Text>
      <Button title='Log in' />
    </View>
  )
}

export default App
