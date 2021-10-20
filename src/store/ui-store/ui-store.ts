import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { Chat, ChatModel } from 'store/chats-store'
import { Contact, ContactModel } from '../contacts-store'
import { InvoiceMsg, InvoiceMsgModel } from './ui-models'
import { withEnvironment } from '../extensions/with-environment'
import { sleep } from 'lib/sleep'

export const UiStoreModel = types
  .model('UiStore')
  .props({
    ready: false,
    selectedChat: types.maybe(types.reference(ChatModel)),
    loadingChat: false,
    applicationURL: types.optional(types.string, ''),
    feedURL: types.optional(types.string, ''),
    searchTerm: '',
    contactsSearchTerm: '',
    tribesSearchTerm: '',
    qrModal: false,
    addFriendDialog: false,
    inviteFriendModal: false,
    addContactModal: false,
    // Reference to why using frozen https://github.com/mobxjs/mobx-state-tree/issues/415
    subModalParams: types.maybeNull(types.map(types.frozen())),
    redeemModalParams: types.maybeNull(types.map(types.frozen())),
    contactSubscribeModal: false,
    contactSubscribeParams: types.maybe(types.reference(ContactModel)),
    newTribeModal: false,
    newGroupModal: false,
    editTribeParams: types.maybeNull(types.map(types.frozen())),
    shareTribeUUID: types.optional(types.string, ''),
    groupModal: false,
    groupModalParams: types.maybe(types.reference(ChatModel)),
    pubkeyModal: false,
    shareInviteModal: false,
    shareInviteString: '',
    showPayModal: false,
    payMode: types.optional(
      types.enumeration('PayMode', ['', 'invoice', 'payment', 'loopout']),
      ''
    ),
    chatForPayModal: types.maybe(types.reference(ChatModel)),
    confirmInvoiceMsg: types.frozen(), // types.maybe(types.reference(InvoiceMsgModel)),
    sendRequestModal: types.maybe(types.reference(ChatModel)),
    viewContact: types.maybe(types.reference(ContactModel)),
    rawInvoiceModal: false,
    rawInvoiceModalParams: types.maybeNull(types.map(types.frozen())),
    lastPaidInvoice: '',
    joinTribeParams: types.maybeNull(types.map(types.frozen())),
    imgViewerParams: types.optional(types.frozen(), {}),
    vidViewerParams: types.maybeNull(types.map(types.frozen())),
    rtcParams: types.maybeNull(types.map(types.frozen())),
    jitsiMeet: false,
    is24HourFormat: false,
    extraTextContent: types.maybeNull(types.map(types.frozen())),
    replyUUID: types.optional(types.string, ''),
    connected: false,
    loadingHistory: false,
    showBots: false,
    startJitsiParams: types.maybeNull(types.map(types.frozen())),
    showProfile: false,
    onchain: false,
    newContact: types.maybeNull(types.map(types.frozen())),
    viewTribe: types.maybeNull(types.map(types.frozen())),
    tribeText: types.maybeNull(types.map(types.frozen())),
    addSatsModal: false,
    showVersionDialog: false,
    paymentRequest: false,
    pinCodeModal: false,
    signedUp: false,
    podcastBoostAmount: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setReady(ready: boolean) {
      self.ready = ready
    },
    setSelectedChat(chat: Chat) {
      self.selectedChat = chat
    },
    setLoadingChat(isLoading: boolean) {
      self.loadingChat = isLoading
    },
    setApplicationURL(url: string) {
      self.applicationURL = url
    },
    setFeedURL(url: string) {
      self.feedURL = url
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
    setQrModal(openDialog: boolean) {
      self.qrModal = openDialog
    },
    setAddFriendDialog(openDialog: boolean) {
      self.addFriendDialog = openDialog
    },
    setInviteFriendModal(openDialog: boolean) {
      self.inviteFriendModal = openDialog
    },
    setAddContactModal(openDialog: boolean) {
      self.addContactModal = openDialog
    },
    setSubModalParams(params: { [k: string]: any } | null) {
      if (!params) {
        self.subModalParams = null
        return
      }
      self.subModalParams?.replace(params)
    },
    setRedeemModalParams(params: { [k: string]: any } | false | null) {
      if (!params) {
        self.redeemModalParams = null
        return
      }
      self.redeemModalParams?.replace(params)
    },
    setContactSubscribeModal(openDialog: boolean, params: Contact) {
      self.contactSubscribeModal = openDialog
      self.contactSubscribeParams = params
    },
    async closeEditContactModal() {
      self.contactSubscribeModal = false
      await sleep(500)
      self.contactSubscribeParams = undefined
    },
    setNewTribeModal(openModal: boolean) {
      self.newTribeModal = openModal
    },
    setNewGroupModal(openDialog: boolean) {
      self.newGroupModal = openDialog
    },
    setEditTribeParams(params: { [k: string]: any } | null) {
      if (!params) {
        // TODO: Check if this will put null as a value or will put a {} object
        self.editTribeParams = null
        return
      }
      self.editTribeParams?.replace({
        ...params,
        escrow_time: params.escrow_millis ? Math.floor(params.escrow_millis / (60 * 60 * 1000)) : 0,
      })
    },
    setShareTribeUUID(uuid: string | null) {
      if (uuid) {
        self.shareTribeUUID = uuid
      } else {
        self.shareTribeUUID = ''
      }
    },
    setGroupModal(groupChat: Chat) {
      self.groupModal = true
      self.groupModalParams = groupChat
    },
    async closeGroupModal() {
      self.groupModal = false
      await sleep(500)
      self.groupModalParams = undefined
    },
    setPubkeyModal(openDialog: boolean) {
      self.pubkeyModal = openDialog
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
    setPayMode(payMode: typeof self.payMode, chat: Chat) {
      self.payMode = payMode
      if (chat) {
        self.chatForPayModal = chat
      }
      self.showPayModal = true
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
    setConfirmInvoiceMsg(msg: InvoiceMsg) {
      // const invoiceMsg = InvoiceMsgModel.create({
      //   payment_request: msg.payment_request,
      //   amount: msg.amount,
      // })
      // self.confirmInvoiceMsg = invoiceMsg
      self.confirmInvoiceMsg = msg
    },
    setSendRequestModal(chat: Chat) {
      self.sendRequestModal = chat
    },
    setViewContact(contact: Contact) {
      self.viewContact = contact
    },
    setRawInvoiceModal(params: { [k: string]: string }) {
      self.rawInvoiceModal = true
      self.lastPaidInvoice = ''
      self.rawInvoiceModalParams?.replace(params)
    },
    async clearRawInvoiceModal() {
      self.rawInvoiceModal = false
      await sleep(500)
      self.rawInvoiceModalParams = null
      self.lastPaidInvoice = ''
    },
    setLastPaidInvoice(invoiceID: string) {
      self.lastPaidInvoice = invoiceID
    },
    setJoinTribeParams(params: { [k: string]: any } | null) {
      if (!params) {
        self.joinTribeParams = null
        return
      }
      self.joinTribeParams?.replace(params)
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
    setRtcParams(params: { [k: string]: any } | null) {
      if (!params) {
        self.rtcParams = null
        return
      }
      self.rtcParams?.replace(params)
    },
    setJitsiMeet(value: boolean) {
      self.jitsiMeet = value
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
    toggleBots(value: boolean) {
      self.showBots = value
    },
    setStartJitsiParams(value: { [k: string]: any } | null) {
      if (!value) {
        self.startJitsiParams = null
        return
      }
      self.startJitsiParams?.replace(value)
    },
    setShowProfile(value: boolean) {
      self.showProfile = value
    },
    setOnchain(onchain: boolean) {
      self.onchain = onchain
    },
    setNewContact(contact: { [k: string]: any } | null) {
      if (!contact) {
        self.newContact = null
        return
      }
      self.newContact?.replace(contact)
    },
    setViewTribe(obj: { [k: string]: any } | null) {
      if (!obj) {
        self.viewTribe = null
        return
      }
      self.viewTribe?.replace(obj)
    },
    setTribeText(chatID: number, text: string) {
      self.tribeText?.set(chatID.toString(), text)
    },
    setAddSatsModal(value: boolean) {
      self.addSatsModal = value
    },
    setShowVersionDialog(value: boolean) {
      self.showVersionDialog = value
    },
    setPaymentRequest(value: boolean) {
      self.paymentRequest = value
    },
    setPinCodeModal(value: boolean) {
      self.pinCodeModal = value
    },
    setSignedUp(value: boolean) {
      self.signedUp = value
    },
    setPodcastBoostAmount(amount: number) {
      self.podcastBoostAmount = amount
    },
  }))

type UiStoreType = Instance<typeof UiStoreModel>
export interface UiStore extends UiStoreType {}
type UiStoreSnapshotType = SnapshotOut<typeof UiStoreModel>
export interface UiStoreSnapshot extends UiStoreSnapshotType {}
export const createUiStoreDefaultModel = () => types.optional(UiStoreModel, {})
