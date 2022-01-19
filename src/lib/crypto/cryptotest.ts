import { display } from 'lib/logging'
import { RSA } from 'react-native-rsa-native'
import { privcert } from './rsa'

const privKey =
  'MIIEpAIBAAKCAQEA+AAzCiIcX/nT0oYIAxP15XXv3caVAfR5A4TlySu2AQYkHc50A25JNiw0WfECWQuJTS7AMW/d5IYyxUguoQ3ydAKz7tkHY4AUMMqTQYl1tyaIgmNR/OJYpe1hx3QJrQVYCPQQcObw3D+ILSU8G26Ew2uTNF1XKgP7CbK1Zv4RzFROzh/3NdWLC7mycB+WFqYwSteCVFCUjKhrbRd0OxDfHlKmcKqEIpAZUoZkT0mJ85dHEPpXSAn8SxzenDx6T1djMj9FstqWf/MwXVz+oOp87hCw2UYu/dEHIpzT8BmLCgYFj9J2lq3ckmb/nOWqNl10aFPJiQIREZJO+xAYHIPXYwIDAQABAoIBAAxvwh97d23OsvMnOoag/R9NK0K1XyqSbnEhPH66nO1vN+dwv3uej7hSPivWfLYncHK46fVwtTFtE2W2SXRVJTfxHMHZC1hPh3Os7PaH5KnTGlxji6yBU0262kDszkFpd7E3QA3RXvnEi9kruVhs0eaU4fRpy+G1AmVJm3Q3QIA9DtMFKrhTMJVe05wXboE5T8pY+lRE0FfmXYe6XvckPdOyGayfgUgZIMXA66gZ21IxrZvzmE3zjqjRI34UUQRW9izzu6bkLqfGUdcMgjuh7YBLLKD+j3iJb+qQend0d775+F0naBQr5dyjrusLvEkNWbi+/iTAoJ0aod0Nr1dviv0CgYEA/YW9+VfWP+OFJO6Hiwi6PJPJS8PbtW2zS3Stct8lGQaKjX7l3T5qwpnc4HYGJ/Ebi6VPsFLZDEXWEv4BP7+w9I4os9RtgvAduAD+Q4sHI1ZtZRkbcsNxbXc0yao8dqZetlR0EKvQjCrv6fBgDlkC5bpEtQeVqut+E4rbInsd02UCgYEA+myksITGtd4ie5jNoIWK+OvsyF0I+qPUQkaMxSVNBwXVJ6YoXTvmpNHYkfwes13QiRc2kc5LLeri1S6foI08sHft3KNHN1GZIcqaOF4fZWpALmkG/AQWk/G23erPZL3gnP/0A+GYzafNbRexUh19POwVyaFC2k9r+5bgr5gPZycCgYEA2GbB20V7zzshWn302tvPRIgNqgt7zijeg4kLyOLqoqrvt4nbIff2XzfAzyRPauam0ZOBKwv80zoFWl7QqB6zKHz0B1RLSho18+t9HiBdLm/GnyZIRLTJbFv1hjI2vDyU2ePK0rQmJo88DJ8vDvAxxfAyV6gqvCOZkYrUNGGM+vUCgYASNCuUmVJIjik7itQHwy1jAuNnfTvV3GrllnNNMXTz+byQ8Ucl3+DYQljX49fnef5auNFCsBhO8jAjBwybgyjSOyWTUFsw7kGPb0beqhjmKl8YAJJ9Z16synlckGEbFaJqR0DZt2CAMp6AO6SsL3CXKSI8UfimHfffhgw3N3qHKQKBgQDTl/WCV5+rqBXYoBegVI/QOrdk3bZFsYrBsBPz1qnZ55xpM82HompNsghjv24g34usfyF4CTqeA0jyPwCassI/TZ7L2uUWXSJFCpGL8XlNzGK30tqr0pJUVfTmfwPHcDHcy7ORyLte8s/XF4P/2JCh7rvpWMfRwoTkzgDhO+42kA=='

export const decryptSimple = async (message, priv) => {
  // display({
  //   name: 'decryptSimple',
  //   important: true,
  //   preview: `Are we here?`,
  //   value: { message, priv, privKey },
  // })
  const wrappedPrivKey = privcert(priv) // priv
  const decryptedMessage = await RSA.decrypt(message, wrappedPrivKey)
  display({
    name: 'decryptSimple',
    // important: true,
    preview: `DECRYPTED: ${decryptedMessage}`,
    value: { message, priv, decryptedMessage },
  })
  return decryptedMessage
}

export const cryptotest = () => {
  const encodedMessage =
    'TroeoSXjMCCQykqR0N/1nByyeTNaSp8o5EgXqlQPmzc7vopDzircrZzjDr+JLdUpt7UJQ/VB7Eq1Rucx0NXXhlD1DzhvZmIT4/8vdD3haFyDsPUE5p3mmQQAioIYNg5nz6Vz2XSI7fMgUCLRGfl/lzA8uSSKof53Ac/YlPnGPOvKEJhGYnPA/ZpRLD+f/dbsZqPIDARZeXrt3X6TAG1YmQuaae8RBrmcrYbbcSgsnW99oilmrEnHJgvl5oR5P5EaBYJWRzV+xw2uXS4PYiFF2Imo8N/vHCxpTtsE2yxZKmfpOhoIdfBXmDMVhNpYcmKx4J9+19ZGkndMGj9nJi/kHw=='

  const wrappedPrivKey = privcert(privKey)

  RSA.decrypt(encodedMessage, wrappedPrivKey).then((decryptedMessage) => {
    console.log(`The original message was ${decryptedMessage}`) // https://guide.getzion.com
  })
}
