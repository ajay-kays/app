export const NUM_SECONDS = 60
export interface StreamPayment {
  feedID: number
  itemID: number
  ts: number
  speed?: string
  title?: string
  text?: string
  url?: string
  pubkey?: string
  type?: string
  uuid?: string
  amount?: number
}