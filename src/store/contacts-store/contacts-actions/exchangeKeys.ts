import { relay } from 'api'

export const exchangeKeys = async (id: number) => {
  try {
    const r = await relay?.post(`contacts/${id}/keys`, {})
    console.log('r', r)
  } catch (e) {
    console.log(e)
  }
}
