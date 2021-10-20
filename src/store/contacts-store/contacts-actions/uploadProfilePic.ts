import { relay } from 'api'
import { createFormData } from 'api/formdata'

export const uploadProfilePic = async (file: any, params: { [k: string]: any }) => {
  try {
    const data = createFormData(file, params)
    const r = await relay?.upload(`upload`, data)
    if (!r) return
    console.log(r)
  } catch (e) {
    console.log(e)
  }
}
