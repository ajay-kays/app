import { useState, useEffect } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { Chat } from 'store/chats-store'
import { Contact } from 'store/contacts-store'
import { constants } from 'lib/constants'
import { useStores } from 'store'
import { reportError } from 'lib/errorHelper'

const conversation = constants.chat_types.conversation

let dirs = RNFetchBlob.fs.dirs

function rnd() {
  return `?rnd=${Math.random().toString(36).substring(7)}`
}

export function usePicSrc(contact: Contact | undefined) {
  if (!usePicSrc) {
    throw 'no usepicsrc'
  }
  const [uri, setURI] = useState('')
  const s = contact && contact.photo_url
  useEffect(() => {
    if (contact && contact.photo_url) {
      setURI(contact.photo_url)
      return
    }
    ;(async () => {
      if (!contact) {
        setURI('')
      } else {
        const src = await contactPicSrc(contact.id)
        if (src && src.uri) setURI('file://' + src.uri + rnd())
      }
    })()
  }, [s])
  return uri
}

export function useChatPicSrc(chat: Chat) {
  const [uri, setURI] = useState('')
  const { contacts, user } = useStores()
  const isConversation = chat && chat.type === conversation
  let s = ''
  if (isConversation) {
    const cid = chat.contact_ids.find((id) => id !== user.myid)
    const contact = contacts.contactsArray.find((c) => c.id === cid)
    s = (contact && contact.photo_url) || ''
  } else {
    s = (chat && chat.photo_url) || ''
  }
  let id: number | null = null
  if (chat && chat.id) id = chat.id
  useEffect(() => {
    ;(async () => {
      if (s) {
        setURI(s)
        return
      }
      if (!chat) {
        setURI('')
        return
      }
      const isConversation = chat.type === conversation
      if (isConversation) {
        const cid = chat.contact_ids.find((id) => id !== user.myid)
        const src = await contactPicSrc(cid)
        if (src && src.uri) setURI('file://' + src.uri + rnd())
      } else {
        const src = await chatPicSrc(chat.id)
        if (src && src.uri) setURI('file://' + src.uri + rnd())
      }
    })()
  }, [s, id])
  return uri
}

const inits = ['pics', 'attachments']
export async function initPicSrc() {
  inits.forEach(async (i) => {
    const path = dirs.CacheDir + '/' + i
    try {
      const is = await RNFetchBlob.fs.isDir(path)
      if (!is) {
        await RNFetchBlob.fs.mkdir(path)
      }
    } catch (e) {
      reportError(e)
    }
  })
}

export async function contactPicSrc(id): Promise<any> {
  const path = dirs.CacheDir + `/pics/contact_${id}`
  try {
    const exists = await RNFetchBlob.fs.exists(path)
    if (exists) return { uri: path }
  } catch (e) {
    reportError(e)
  }
  return null
}

export async function chatPicSrc(id): Promise<any> {
  const path = dirs.CacheDir + `/pics/chat_${id}`
  try {
    const exists = await RNFetchBlob.fs.exists(path)
    if (exists) {
      return { uri: path }
    }
  } catch (e) {
    console.log('error chatPicSrc', e)
    reportError(e)
  }
  return null
}

export async function createContactPic(id, uri): Promise<any> {
  const path = dirs.CacheDir + `/pics/contact_${id}`
  try {
    const r = await RNFetchBlob.fs.cp(uri, path)
    return path
  } catch (e) {
    console.log('error createContactPic', e)
    reportError(e)
  }
}

export async function createChatPic(id, uri): Promise<any> {
  const path = dirs.CacheDir + `/pics/chat_${id}`
  try {
    const r = await RNFetchBlob.fs.cp(uri, path)
    return path
  } catch (e) {
    console.log('error createChatPic', e)
    reportError(e)
  }
}
