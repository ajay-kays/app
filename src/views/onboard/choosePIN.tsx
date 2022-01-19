import React from 'react'
import { observer } from 'mobx-react-lite'
import Slider from '../utils/slider'
import PIN from '../utils/pin'

function ChoosePIN(props) {
  const { mode = 'choose', onDone, z, show, onBack } = props
  return (
    <Slider z={z} show={show} accessibilityLabel='onboard-PIN'>
      <PIN mode={mode} onFinish={onDone} onBack={onBack} />
    </Slider>
  )
}

export default observer(ChoosePIN)
