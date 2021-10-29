import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from 'store'
import ConfirmPayInvoice from './confirmPayInvoice'
import ShareInvite from './shareInvite'
import VideoViewer from './vidViewer'

function Modals() {
  const { ui } = useStores()
  const showConfirmPayInvoice =
    ui.confirmInvoiceMsg && ui.confirmInvoiceMsg.payment_request ? true : false
  const showVid = ui.vidViewerParams ? true : false
  return (
    <>
      <ShareInvite visible={ui.shareInviteModal} />
      <ConfirmPayInvoice visible={showConfirmPayInvoice} />
      <VideoViewer params={showVid} visible={ui.vidViewerParams} />
    </>
  )
}

export default observer(Modals)
