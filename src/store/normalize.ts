import { display, log } from 'lib/logging'
import { Chat, ChatModel } from './chats-store'
import { Contact, ContactModel } from './contacts-store'
import { Msg, MsgModel } from './msg-store'

export const normalizeChat = (raw: any) => {
  try {
    const normalized: Chat = ChatModel.create({
      app_url: raw.app_url ?? '',
      contact_ids: raw.contact_ids ?? null,
      created_at: raw.created_at,
      deleted: parseBool(raw.deleted),
      escrow_amount: raw.escrow_amount ?? 0,
      escrow_millis: raw.escrow_millis ?? 0,
      feed_url: raw.feed_url ?? '',
      group_key: raw.group_key ?? '',
      host: raw.host ?? '',
      id: raw.id,
      invite: raw.invite ?? null,
      is_muted: parseBool(raw.is_muted),
      meta: !!raw.meta ? JSON.parse(raw.meta) : null,
      my_alias: raw.my_alias ?? '',
      my_photo_url: raw.my_photo_url ?? '',
      name: raw.name ?? '',
      owner_pubkey: raw.owner_pubkey ?? '',
      photo_url: raw.photo_url ?? '',
      price_per_message: raw.price_per_message ?? 0,
      pricePerMinute: raw.pricePerMinute ?? 0,
      price_to_join: raw.price_to_join ?? 0,
      private: parseBool(raw.private),
      status: raw.status ?? 0, // unsure if this is the right default
      type: raw.type,
      unlisted: parseBool(raw.unlisted),
      updated_at: raw.updated_at,
      uuid: raw.uuid,
    })
    return normalized
  } catch (e) {
    console.log(e)
  }
}

export const normalizeContact = (raw: any) => {
  try {
    const normalized: Contact = ContactModel.create({
      alias: raw.alias ?? '',
      auth_token: raw.auth_token,
      contact_key: raw.contact_key,
      created_at: raw.created_at,
      deleted: parseBool(raw.deleted),
      device_id: raw.device_id,
      from_group: parseBool(raw.from_group),
      id: raw.id,
      is_owner: parseBool(raw.is_owner),
      node_alias: raw.node_alias,
      photo_url: raw.photo_url,
      private_photo: parseBool(raw.private_photo),
      public_key: raw.public_key,
      remote_id: raw.remote_id,
      route_hint: raw.route_hint,
      status: raw.status,
      updated_at: raw.updated_at,
    })
    return normalized
  } catch (e) {
    console.log('ERROR:', e)
  }
}

export const normalizeMessage = (raw: any) => {
  // log(raw)
  // display({
  //   name: 'normalizeMessage',
  //   value: raw,
  //   important: true,
  // })
  try {
    const normalized: Msg = MsgModel.create({
      id: raw.id,
      chat_id: raw.chat_id ?? 0, // ?
      type: raw.type,
      uuid: raw.uuid ?? '',
      sender: raw.sender,
      receiver: raw.receiver,
      amount: raw.amount,
      amount_msat: raw.amount_msat,
      payment_hash: raw.payment_hash,
      payment_request: raw.payment_request,
      date: raw.date,
      expiration_date: raw.expiration_date,
      message_content: raw.message_content,
      remote_message_content: raw.remote_message_content,
      status: raw.status,
      status_map: raw.status_map,
      parent_id: raw.parent_id,
      subscription_id: raw.subscription_id,
      media_type: raw.media_type,
      media_token: raw.media_token,
      media_key: raw.media_key,
      seen: parseBool(raw.seen),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      sender_alias: raw.sender_alias,
      sender_pic: raw.sender_pic,

      original_muid: raw.original_muid,
      reply_uuid: raw.reply_uuid,

      text: raw.text,

      chat: raw.chat, //ChatModel,

      sold: raw.sold, // this is a marker to tell if a media has been sold
      showInfoBar: raw.showInfoBar, // marks whether to show the date and name

      reply_message_content: raw.reply_message_content,
      reply_message_sender_alias: raw.reply_message_sender_alias,
      reply_message_sender: raw.reply_message_sender,

      boosts_total_sats: raw.boosts_total_sats,
      boosts: raw.boosts,
    })
    // display({
    //   name: `normalizeMessage `,
    //   preview: `${normalized.id} - ${normalized.message_content}`,
    //   value: { raw, normalized },
    //   important: true,
    // })
    return normalized
  } catch (e) {
    console.log(e)
    display({
      name: 'Could not normalize msg',
      important: true,
    })
  }
}

const parseBool = (zeroorone: number) => {
  return Boolean(Number(zeroorone)) ?? false
}
