import * as api from 'api'
import { UserStore } from '../user-store'

export const registerMyDeviceId = async (self: UserStore, device_id, myid) => {
  try {
    const r = await api.relay?.put(`contacts/${myid}`, { device_id })

    if (!r) return
    if (r.device_id) {
      self.deviceId = r.device_id
    }
  } catch (e) {
    console.log(e)
  }
}
