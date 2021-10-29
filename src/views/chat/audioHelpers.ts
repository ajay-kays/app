import { PermissionsAndroid } from 'react-native' // ?
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions'
import * as e2e from 'lib/crypto/e2e'
import { randString } from 'lib/crypto/rand'
import RNFetchBlob from 'rn-fetch-blob'

export async function uploadAudioFile(uri, server, callback) {
  const pwd = await randString(32)
  console.log('uploadAudioFile:', uri, server, callback)
  if (!server) return
  if (!uri) return

  const type = 'audio/mp4'
  const filename = 'sound.mp4'
  const newUri = uri.replace('file://', '')
  const enc = await e2e.encryptFile(newUri, pwd)

  RNFetchBlob.fetch(
    'POST',
    `https://${server.host}/file`,
    {
      Authorization: `Bearer ${server.token}`,
      'Content-Type': 'multipart/form-data',
    },
    [
      {
        name: 'file',
        filename,
        type: type,
        data: enc,
      },
      { name: 'name', data: filename },
    ]
  )
    // listen to upload progress event, emit every 250ms
    .uploadProgress({ interval: 250 }, (written, total) => {
      console.log('uploaded', written / total)
      // setUploadedPercent(Math.round((written / total)*100))
    })
    .then(async (resp) => {
      let json = resp.json()
      callback(json.muid, pwd, type)
    })
    .catch((err) => {
      console.log(err)
    })
}

const getPermission = async (permission) => {
  const permissionStatus = await check(permission)

  if (permissionStatus === RESULTS.GRANTED) return true
  if (permissionStatus === RESULTS.DENIED) {
    const newPermissionStatus = await request(permission)
    return newPermissionStatus === RESULTS.GRANTED
  }
  return false
}

const checkPermissions = async (...permissions) => permissions.every(getPermission)

const requestWriteExternalStoragePermission = async () => {
  const storageResponse = await checkPermissions(
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    PERMISSIONS.IOS.MEDIA_LIBRARY
  )

  if (storageResponse) {
    console.log('You can use the storage')
    return
  }
  console.log(`${PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE} - permission denied`)
}

const requestRecordAudioPermission = async () => {
  const microphoneResponse = await checkPermissions(
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.IOS.MICROPHONE
  )

  if (microphoneResponse) {
    console.log('You can record audio')
    return
  }
  console.log(
    `${PERMISSIONS.ANDROID.RECORD_AUDIO}, ${PERMISSIONS.IOS.MICROPHONE} - permission denied`
  )
}

export async function requestAudioPermissions() {
  await Promise.all([requestWriteExternalStoragePermission(), requestRecordAudioPermission()])
}
