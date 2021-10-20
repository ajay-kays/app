import { DetailsStore } from 'store/details-store'
import { relay } from 'api'

export function getVersions(_: DetailsStore): () => Promise<any> {
  return async () => {
    try {
      const r = await relay?.get('app_versions')
      if (r) return r
    } catch (e) {
      console.log(e)
    }
  }
}
