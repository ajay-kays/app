import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { Chat, ChatModel } from 'store/chats-store'
import { InvoiceMsg, InvoiceMsgModel } from './ui-models'
import { withEnvironment } from '../extensions/with-environment'
import { sleep } from 'lib/sleep'
import { reset } from 'store'

export const UiStoreModel = types
  .model('UiStore')
  .props({
    /** Search term inputs */
    searchTerm: '',
    contactsSearchTerm: '',
    tribesSearchTerm: '',
    /** Dialog visibility */
    addFriendDialog: false,
    /** Modal visibility */
    addContactModal: false,
    addContactParams: types.optional(types.frozen(), {}),
    restoringModal: false,
    restoredMessages: 0,

    chatMsgsLoading: types.maybeNull(types.number),

    newTribeModal: false,
    showPayModal: false,
    /** Pay mode (Payment Modal) */
    payMode: types.optional(
      types.enumeration('PayMode', ['', 'invoice', 'payment', 'loopout']),
      ''
    ),
    isPayModeFromWallet: false,
    /** When paying in a chat - needs testing */
    chatForPayModal: types.maybe(types.reference(ChatModel)),
    /** Set community UUID for ShareGroup modal */
    shareCommunityUUID: types.optional(types.string, ''),
    /** InviteRow share modal */
    shareInviteModal: false,
    shareInviteString: '',
    /** Confirm invoice info - let's add proper types here */
    confirmInvoiceMsg: types.frozen(), // types.maybe(types.reference(InvoiceMsgModel)),
    /** Set via websocket handler - shows whether an invoice has been paid */
    lastPaidInvoice: '',
    /** PostPhoto img params - set by bottombar */
    imgViewerParams: types.optional(types.frozen(), {}),
    /** mediamsg vid player params, we think */
    vidViewerParams: types.maybeNull(types.map(types.frozen())),
    /** Set in app init via react-native-device-time-format, used by msg infobar */
    is24HourFormat: false,
    /** Something from chat bottombar */
    // [NEEDED???] Reference to why using frozen https://github.com/mobxjs/mobx-state-tree/issues/415
    extraTextContent: types.maybeNull(types.map(types.frozen())),
    /** Reply UUID for bottombar replying */
    replyUUID: types.optional(types.string, ''),
    /** Connected to node? Lightning bolt header icon */
    connected: false,
    /** Loading history for activity indicators */
    loadingHistory: false,
    /** Determines whether pinCodeModal shows on homepage */
    pinCodeModal: false,
    /** Signed up? */
    signedUp: false,
    /** Podcast boost amount from BoostControls */
    podcastBoostAmount: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setRestoringModal(show: boolean) {
      self.restoringModal = show
    },
    setMessagesRestored(num: number) {
      self.restoredMessages = num
    },
    setSearchTerm(term: string) {
      self.searchTerm = term
    },
    setContactsSearchTerm(term: string) {
      self.contactsSearchTerm = term
    },
    setTribesSearchTerm(term: string) {
      self.tribesSearchTerm = term
    },
    setAddFriendDialog(openDialog: boolean) {
      self.addFriendDialog = openDialog
    },
    setAddContactModal(openDialog: boolean, params?: { [k: string]: any } | null) {
      self.addContactModal = openDialog

      if (!params) {
        self.addContactParams = null
        return
      }
      self.addContactParams = params
    },
    setNewTribeModal(openModal: boolean) {
      self.newTribeModal = openModal
    },
    setShareCommunityUUID(uuid: string | null) {
      if (uuid) {
        self.shareCommunityUUID = uuid
      } else {
        self.shareCommunityUUID = ''
      }
    },
    setShareInviteModal(inviteCode: string) {
      self.shareInviteModal = true
      self.shareInviteString = inviteCode
    },
    async clearShareInviteModal() {
      self.shareInviteModal = false
      await sleep(500)
      self.shareInviteString = ''
    },
    setPayMode(payMode: typeof self.payMode, chat: Chat | null) {
      self.payMode = payMode
      if (chat) {
        self.chatForPayModal = chat
      }
      self.showPayModal = true
    },
    setIsPayModeFromWallet(bool: boolean = false) {
      self.isPayModeFromWallet = bool
    },
    async clearPayModal() {
      try {
        self.showPayModal = false
        await sleep(500)
        self.payMode = ''
        self.chatForPayModal = undefined
      } catch (e) {
        console.log('ERROR:', e)
      }
    },
    setConfirmInvoiceMsg(msg: any) {
      // InvoiceMsg
      // const invoiceMsg = InvoiceMsgModel.create({
      //   payment_request: msg.payment_request,
      //   amount: msg.amount,
      // })
      // self.confirmInvoiceMsg = invoiceMsg
      self.confirmInvoiceMsg = msg
    },
    setLastPaidInvoice(invoiceID: string) {
      self.lastPaidInvoice = invoiceID
    },
    setImgViewerParams(params: { [k: string]: any } | null) {
      if (!params) {
        self.imgViewerParams = null
        return
      }
      // self.imgViewerParams.replace(params) // threw error
      self.imgViewerParams = params
    },
    setVidViewerParams(params: { [k: string]: any } | null) {
      if (!params) {
        self.vidViewerParams = null
        return
      }
      self.vidViewerParams?.replace(params)
    },
    setIs24HourFormat(value: boolean) {
      self.is24HourFormat = value
    },
    setExtraTextContent(obj: { [k: string]: any } | null) {
      if (!obj) {
        self.extraTextContent = null
        return
      }
      self.extraTextContent?.replace(obj)
    },
    setReplyUUID(uuid: string) {
      self.replyUUID = uuid
    },
    setConnected(connected: boolean) {
      self.connected = connected
    },
    setLoadingHistory(value: boolean) {
      self.loadingHistory = value
    },
    setPinCodeModal(value: boolean) {
      self.pinCodeModal = value
    },
    setSignedUp(value: boolean) {
      self.signedUp = value
    },
    setPodcastBoostAmount(amount: number | null) {
      if (!amount) {
        self.podcastBoostAmount = 0
      } else {
        self.podcastBoostAmount = amount
      }
    },
    setChatMsgsLoading(value: number | null) {
      self.chatMsgsLoading = value
    },
    reset: () => reset(self),
  }))

type UiStoreType = Instance<typeof UiStoreModel>
export interface UiStore extends UiStoreType { }
type UiStoreSnapshotType = SnapshotOut<typeof UiStoreModel>
export interface UiStoreSnapshot extends UiStoreSnapshotType { }
export const createUiStoreDefaultModel = () => types.optional(UiStoreModel, {})
