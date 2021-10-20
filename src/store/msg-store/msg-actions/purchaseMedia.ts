import { relay } from 'api'

export const purchaseMedia = async ({
  contact_id,
  amount,
  chat_id,
  media_token,
}: PurchaseMediaParams) => {
  try {
    const v = {
      contact_id: contact_id || null,
      chat_id: chat_id || null,
      amount: amount,
      media_token: media_token,
    }

    await relay?.post('purchase', v)
  } catch (e) {
    console.log(e)
  }
}

export interface PurchaseMediaParams {
  contact_id: number
  amount: number
  chat_id: number
  media_token: string
}
