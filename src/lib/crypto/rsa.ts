import { RSAKeychain, RSA } from 'react-native-rsa-native'
// global.Buffer = global.Buffer || require('buffer').Buffer
import { Buffer } from 'buffer'
import EncryptedStorage from 'react-native-encrypted-storage'
import { reportError } from 'lib/errorHelper'
import { display } from 'lib/logging'
import { decryptSimple } from './cryptotest'

const KEY_SIZE = 2048
const KEY_TAG = 'sphinx'

const BLOCK_SIZE = 256
const MAX_CHUNK_SIZE = BLOCK_SIZE - 12 // 11 is the PCKS1 padding

export async function generateKeyPair(): Promise<{
  private: string
  public: string
}> {
  try {
    const keys = await RSA.generateKeys(KEY_SIZE)
    const priv = privuncert(keys.private)
    const pub = pubuncert(keys.public)

    // await SecureStorage.setItem('private', priv, { service: 'sphinx_encryption_key' })
    await EncryptedStorage.setItem('private', priv)

    return { private: priv, public: pub }
  } catch (e) {
    reportError(e)
    return { private: '', public: '' }
  }
}

export async function getPrivateKey() {
  try {
    // const config = { service: 'sphinx_encryption_key' }
    // const got = await SecureStorage.getItem('private', config)
    // return got
    const item = await EncryptedStorage.getItem('private')

    return item
  } catch (e) {
    reportError(e)
  }
}

export async function setPrivateKey(priv) {
  try {
    // const config = { service: 'sphinx_encryption_key' }
    // const got = await SecureStorage.setItem('private', priv, config)
    // return got
    await EncryptedStorage.setItem('private', priv)

    return priv
  } catch (e) {
    reportError(e)
  }
}

export async function decrypt(data) {
  try {
    const priv = await EncryptedStorage.getItem('private')
    const wrappedPrivKey = privcert(priv)
    const decryptedMessage = await RSA.decrypt(data, wrappedPrivKey)
    display({
      name: 'decrypt',
      preview: `Decrypted?: ${decryptedMessage}`,
      value: { wrappedPrivKey, priv, decryptedMessage, data },
    })
    return decryptedMessage
  } catch (e) {
    console.log(e)
    display({
      name: 'decrypt',
      value: { data },
      preview: 'Decryption Error',
      important: true,
    })
    reportError(e)
  }
  display({
    name: 'decrypt',
    value: { data },
    preview: 'Decryption - Returning empty',
    important: true,
  })
  console.log('returning empty...')
  return ''
}

export async function keyGen() {
  try {
    const keys = await RSAKeychain.generateKeys(KEY_TAG, KEY_SIZE)
    return pubuncert(keys.public)
  } catch (e) {
    reportError(e)
  }
  return ''
}

export async function getPublicKey() {
  try {
    const pub = await RSAKeychain.getPublicKey(KEY_TAG)
  } catch (e) {
    reportError(e)
  }
}

// ENCRYPT UTF8
export async function encrypt(data, pubkey) {
  const key = pubcert(pubkey)
  try {
    const final = await RSA.encrypt(data, key)
    console.log('encrypted:', final)
    return final

    // const buf = Buffer.from(data)
    // let dataArray: any[] = []
    // let finalBuf = Buffer.from([])
    // const n = Math.ceil(buf.length / MAX_CHUNK_SIZE)
    // const arr = Array(n).fill(0)
    // arr.forEach((_, i) => {
    //   const sub = buf
    //     .subarray(i * MAX_CHUNK_SIZE, i * MAX_CHUNK_SIZE + MAX_CHUNK_SIZE)
    //     .toString('utf8')
    //   dataArray.push(sub)
    // })
    // await asyncForEach(dataArray, async (d) => {
    //   const enc = await RSA.encrypt(d, key)
    //   const encBuf = Buffer.from(enc.replace(/[\r\n]+/gm, ''), 'base64')
    //   finalBuf = Buffer.concat([finalBuf, encBuf])
    // })
    // return finalBuf.toString('base64')
  } catch (e) {
    reportError(e)
  }
  return ''
}

// DECRYPT BASE64
export async function decryptOld(data) {
  try {
    const buf = Buffer.from(data, 'base64')
    let dataArray: any[] = []
    let finalDec = ''
    const n = Math.ceil(buf.length / BLOCK_SIZE)
    const arr = Array(n).fill(0)
    arr.forEach((_, i) => {
      dataArray.push(buf.subarray(i * BLOCK_SIZE, i * BLOCK_SIZE + BLOCK_SIZE).toString('base64'))
    })
    await asyncForEach(dataArray, async (d) => {
      const dec = await RSAKeychain.decrypt(d, KEY_TAG)
      finalDec += dec
    })
    return finalDec
  } catch (e) {
    reportError(e)
  }
  return ''
}

export async function testRSA() {
  const msg = 'my secret message'
  try {
    const keys = await keyGen()
    console.log(keys)
    const enc = await encrypt(msg, keys.public)
    const dec = await decrypt(enc)
    console.log('MESSAGE:', dec)
  } catch (e) {
    reportError(e)
  }
}

function pubuncert(key) {
  let s = key
  s = s.replace('-----BEGIN RSA PUBLIC KEY-----', '')
  s = s.replace('-----END RSA PUBLIC KEY-----', '')
  return s.replace(/[\r\n]+/gm, '')
}
function pubcert(key) {
  return '-----BEGIN RSA PUBLIC KEY-----\n' + key + '\n' + '-----END RSA PUBLIC KEY-----'
}
export function privcert(key) {
  return '-----BEGIN RSA PRIVATE KEY-----\n' + key + '\n' + '-----END RSA PRIVATE KEY-----'
}
function privuncert(key) {
  let s = key
  s = s.replace('-----BEGIN RSA PRIVATE KEY-----', '')
  s = s.replace('-----END RSA PRIVATE KEY-----', '')
  return s.replace(/[\r\n]+/gm, '')
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
