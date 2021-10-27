import React from 'react'
import { observer } from 'mobx-react-lite'
import ModalWrap from './ModalWrap'

function PinCodeModal({ visible, close, children }) {
  return (
    <ModalWrap visible={visible} onClose={close} noHeader noSwipe>
      {children}
    </ModalWrap>
  )
}

export default observer(PinCodeModal)

PinCodeModal.defaultProps = {
  close: () => {},
}
