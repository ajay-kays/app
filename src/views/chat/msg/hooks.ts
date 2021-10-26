import { useEffect, useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { useStores } from '../../../store'
import * as aes from 'lib/crypto/aes'
import { decode as atob } from 'base-64'
import { isBase64 } from 'lib/crypto/Base64'
import { reportError } from 'lib/errorHelper'

const sess = 'all'

let dirs = RNFetchBlob.fs.dirs

// RNFetchBlob.fs.unlink(folder) to kill all there

type UseCachedEncryptedFile = {
  data: string
  uri: string
  loading: boolean
  trigger: () => any
  dispose: () => any
  paidMessageText: string
}
export function useCachedEncryptedFile(
  props,
  ldat,
  dispatchTrigger = false
): UseCachedEncryptedFile {
  const { meme } = useStores()
  const { id, media_key, media_type, media_token, message_content } = props

  const [data, setData] = useState('')
  const [uri, setURI] = useState('')
  const [loading, setLoading] = useState(false)
  const [paidMessageText, setPaidMessageText] = useState(null)
  const isPaidMessage = media_type === 'n2n2/text'

  function dispose() {
    RNFetchBlob.session(sess)
      .dispose()
      .then(() => {
        console.log(`${sess} disposed`)
      })
  }

  async function trigger() {
    if (loading || data || uri || paidMessageText) return // already done
    if (!ldat?.host || !ldat?.sig) return

    const url = `https://${ldat.host}/file/${media_token}`

    const server = meme.servers.find((s) => s.host === ldat.host)

    setLoading(true)
    // if img already exists return it
    const existingPath = dirs.CacheDir + `/attachments/msg_${id}_decrypted`
    const exists = await RNFetchBlob.fs.exists(existingPath)

    if (exists) {
      if (isPaidMessage) {
        const txt = await parsePaidMsg(id)
        setPaidMessageText(txt)
      } else {
        setURI('file://' + existingPath)
      }
      setLoading(false)
      return
    }

    if (!server) return
    try {
      const res = await RNFetchBlob.config({
        path: dirs.CacheDir + `/attachments/msg_${id}`,
      }).fetch('GET', url, {
        Authorization: `Bearer ${server.token}`,
      })
      // console.log('The file saved to ', res.path())

      const headers = res.info().headers
      const disp = headers['Content-Disposition']

      if (disp) {
        const arr = disp.split('=')
        if (arr.length === 2) {
          const filename = arr[1]
          if (filename) meme.addToFilenameCache(id, filename)
        }
      }

      const path = res.path()
      const status = res.info().status

      if (status == 200 && path) {
        let extension = ''
        if (media_type.startsWith('audio')) {
          extension = 'm4a'
        }

        if (isPaidMessage) {
          const txt = await aes.decryptFileAndSaveReturningContent(path, media_key, extension)
          setPaidMessageText(media_type === 'n2n2/text' ? isBase64(txt).text : txt)
        } else {
          const newpath = await aes.decryptFileAndSave(path, media_key, extension)
          setURI('file://' + newpath)
        }
        setLoading(false)
      }
      // if(status == 200 && path){
      //   console.log("DECRYPT", path, media_key)
      //   const dec = await aes.readEncryptedFile(path, media_key)
      //   const dataURI = `data:${media_type};base64,${dec}`
      //   console.log('got data URI', dataURI.length)
      //   setData(dataURI)
      //   setLoading(false)
      // }

      // let status = res.info().status
      // if(status == 200) {
      //   let base64Str = res.base64() // native conversion
      //   console.log('dec w pwd',media_key)
      //   const dec = await aes.decryptToBase64(base64Str, media_key)
      //   const dataURI = `data:${media_type};base64,${dec}`
      //   console.log(`data:${media_type};base64,${dataURI.length}`)
      //   setImgData(dataURI)
      //   setLoading(false)
      // }
    } catch (e) {
      reportError(e)
    }
  }

  useEffect(() => {
    if (!media_token || paidMessageText || !dispatchTrigger) return
    trigger()
  }, [media_token, paidMessageText, ldat])

  return { data, uri, loading, trigger, dispose, paidMessageText: paidMessageText ?? '' }
}

async function parsePaidMsg(id) {
  try {
    const path = dirs.CacheDir + `/attachments/msg_${id}_decrypted`
    const data = await RNFetchBlob.fs.readFile(path, 'base64')
    return atob(data)
  } catch (e) {
    reportError(e)
  }
}
