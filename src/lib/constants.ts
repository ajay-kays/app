import { Dimensions } from 'react-native'
// import { getStatusBarHeight } from 'react-native-status-bar-height'

export const appConstants = {
  invite_statuses: {
    pending: 0,
    ready: 1,
    delivered: 2,
    in_progress: 3,
    complete: 4,
    expired: 5,
    payment_pending: 6,
  },
  contact_statuses: {
    pending: 0,
    confirmed: 1,
  },
  statuses: {
    pending: 0,
    confirmed: 1,
    cancelled: 2,
    received: 3,
    failed: 4,
    deleted: 5,
  },
  chat_statuses: {
    approved: 0,
    pending: 1,
    rejected: 2,
  },
  message_types: {
    message: 0,
    confirmation: 1,
    invoice: 2,
    payment: 3,
    cancellation: 4,
    direct_payment: 5,
    attachment: 6,
    purchase: 7,
    purchase_accept: 8,
    purchase_deny: 9,
    contact_key: 10,
    contact_key_confirmation: 11,
    group_create: 12,
    group_invite: 13,
    group_join: 14,
    group_leave: 15,
    group_kick: 16,
    delete: 17,
    repayment: 18,
    member_request: 19,
    member_approve: 20,
    member_reject: 21,
    tribe_delete: 22,
    bot_install: 23,
    bot_cmd: 24,
    bot_res: 25,
    keysend: 28,
    boost: 29,
  },
  payment_errors: {
    timeout: 'Timed Out',
    no_route: 'No Route To Receiver',
    error: 'Error',
    incorrect_payment_details: 'Incorrect Payment Details',
    unknown: 'Unknown',
  },
  chat_types: {
    conversation: 0,
    group: 1,
    tribe: 2,
  },
}

type SwitcherReturn = {
  [key: string]: {
    [nestedKey: number]: string
  }
}

const switcher: (value: typeof appConstants) => SwitcherReturn = (consts: typeof appConstants) => {
  const codes = {}
  for (const [k, obj] of Object.entries(consts)) {
    for (const [str, num] of Object.entries(obj)) {
      if (!codes[k]) codes[k] = {}
      codes[k][num] = str
    }
  }
  // dont switch this one
  return { ...codes, payment_errors: consts.payment_errors }
}

export const constantCodes = switcher(appConstants)

export const TRIBE_SIZE_LIMIT = 20

export const TOAST_DURATION = 0.5
export const STACK_HEADER_HEIGHT = 60
export const TAB_HEIGHT = 50

export const SCREEN_HEIGHT: number = Math.round(Dimensions.get('window').height)
export const SCREEN_WIDTH: number = Math.round(Dimensions.get('window').width)
export const STATUS_BAR_HEIGHT: number = 25 // ?
// export const STATUS_BAR_HEIGHT: number = getStatusBarHeight()
export const constants = appConstants
