import React from 'react'

import Pushable from '../Pushable'
import Button from './index'

export default function PushableButton(props) {
  let { onPress, scale, children } = props

  return (
    <Pushable onPress={onPress} scale={scale}>
      <Button {...props} pushable>
        {children}
      </Button>
    </Pushable>
  )
}

PushableButton.defaultProps = {
  mode: 'contained',
  scale: 0.9,
  size: 'medium',
}
