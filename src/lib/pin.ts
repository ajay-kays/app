// import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage'

export async function setPinCode(pin: string): Promise<any> {
  // AsyncStorage.setItem('pin_entered', ts())
  await EncryptedStorage.setItem('pin', pin)
  return pin
}
