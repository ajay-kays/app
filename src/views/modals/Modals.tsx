import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from 'store'
import ConfirmPayInvoice from './confirmPayInvoice'
import ShareInvite from './shareInvite'
import VideoViewer from './vidViewer'
import { RestoringMessages } from './restoringMessages'

function Modals() {
  const { ui } = useStores()
  const showConfirmPayInvoice =
    ui.confirmInvoiceMsg && ui.confirmInvoiceMsg.payment_request ? true : false
  const showVid = ui.vidViewerParams ? true : false
  const restoringModalVisible = ui.restoringModal
  return (
    <>
      <ShareInvite visible={ui.shareInviteModal} />
      <ConfirmPayInvoice visible={showConfirmPayInvoice} />
      <VideoViewer params={showVid} visible={ui.vidViewerParams} />
      <RestoringMessages visible={restoringModalVisible} />
    </>
  )
}

export default observer(Modals)
