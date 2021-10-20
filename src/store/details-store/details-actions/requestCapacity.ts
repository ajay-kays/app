import { DetailsStore } from 'store/details-store'
import { DEFAULT_HUB_API } from 'lib/config'

export async function requestCapacity(self: DetailsStore, pubKey: string) {
  try {
    const payload = {
      pubKey,
    }

    const url = `${DEFAULT_HUB_API}request_capacity`

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const j = await r.json()

    if (j.done) {
      return true
    }

    return false

    // return j
  } catch (e) {
    console.log(e)

    return false
  }
}
