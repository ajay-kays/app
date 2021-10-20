import { Instance, types } from 'mobx-state-tree'

export const InviteModel = types.model('Invite').props({
  id: types.identifierNumber,
  contact_id: types.number,
  created_at: types.string,
  invite_string: types.string,
  price: types.number,
  status: types.number,
  updated_at: types.string,
  welcome_message: types.string,
})

export const ContactModel = types.model('Contact').props({
  alias: types.string,
  auth_token: types.maybeNull(types.string),
  contact_key: types.maybeNull(types.string),
  created_at: types.string,
  deleted: types.boolean,
  device_id: types.maybeNull(types.string),
  from_group: types.boolean,
  id: types.identifierNumber,
  invite: types.maybeNull(InviteModel),
  is_owner: types.boolean,
  node_alias: types.maybeNull(types.string),
  photo_url: types.maybeNull(types.string),
  private_photo: types.boolean,
  public_key: types.string,
  remote_id: types.maybeNull(types.number),
  route_hint: types.maybeNull(types.string),
  status: types.maybeNull(types.number),
  updated_at: types.string,
})

export interface Contact extends Instance<typeof ContactModel> {}
export interface Invite extends Instance<typeof InviteModel> {}
