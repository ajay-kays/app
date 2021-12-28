import { Platform } from 'react-native'
import * as api from 'api'

export const requestInvite = async (_, email) => {
  try {
    if (!email) return

    const platform = Platform
    const r = await api.shop.post('invite_request', { email, platform }, '', {
      rawValue: true,
    })
    if (!r) throw new Error('Failed')

    return {
      status: 'ok',
      payload: { id: r?.invite?.id, duplicate: !!r?.exist },
    }
  } catch (error) {
    console.log('error store', error)
    return { status: 'failure' }
  }
}
