import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import * as aes from '../crypto/aes'

export const AesCryptorTest = () => {
  const [sayenc, setEnc] = useState('')
  const [saydec, setDec] = useState('')
  useEffect(() => {
    ;(async () => {
      const enc = await aes.encrypt('SECRET MESSAGE', '1234')
      setEnc(enc)
      const dec = await aes.decrypt(enc, '1234')
      setDec(dec)
    })()
  }, [])
  return (
    <View style={{ padding: 15 }}>
      <Text style={{ color: 'white', marginBottom: 20 }}>AES Encryption Test</Text>
      <Text style={{ color: 'white' }}>Encrypted: {sayenc}</Text>
      <Text style={{ color: 'white' }}>Decrypted: {saydec}</Text>
    </View>
  )
}
