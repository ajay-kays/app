import React from 'react'
import { observer } from 'mobx-react-lite'
import AddFriend from './AddFriend'

function Dialogs() {
  return (
    <>
      <AddFriend />
    </>
  )
}

export default observer(Dialogs)
