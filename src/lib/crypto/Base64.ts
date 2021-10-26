import base64 from 'react-native-base64'

export function isBase64(strB64: string) {
  if (!strB64)
    return {
      text: strB64 || '',
      isB64: false,
      isValid: false,
    }
  try {
    return {
      text: base64.decode(strB64),
      isB64: false,
      isValid: true,
    }
  } catch (error) {
    return {
      text: strB64,
      isB64: false,
      isValid: true,
    }
  }
}
