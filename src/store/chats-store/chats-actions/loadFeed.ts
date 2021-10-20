import { DEFAULT_TRIBE_SERVER } from 'lib/config'

export const loadFeed = async (host: string, uuid: string, url: string) => {
  if (!host || !url) return
  const theHost = host.includes('localhost') ? DEFAULT_TRIBE_SERVER : host
  try {
    const r = await fetch(`https://${theHost}/podcast?url=${url}`)
    const j = await r.json()

    return j
  } catch (e) {
    console.log('error loading podcast', e)
    return null
  }
}
