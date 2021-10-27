import React from 'react'
import { observer } from 'mobx-react-lite'
import Slider from '../utils/slider'
import PIN from '../utils/pin'

function ChoosePIN(props) {
  const { onDone, z, show } = props
  return (
    <Slider z={z} show={show} accessibilityLabel='onboard-PIN'>
      <PIN mode='choose' onFinish={onDone} />
    </Slider>
  )
}

export default observer(ChoosePIN)
