import React from 'react'
import { observer } from 'mobx-react-lite'
import AddContact from './AddContact'
import Payment from './Payment'
import ShareGroup from './ShareGroup'
import AddCommunity from './Community/AddCommunity'
import JoinCommunityModal from './Community/JoinCommunity'
import PostPhoto from './PostPhoto'

function Modals() {
  return (
    <>
      <AddContact />
      <PostPhoto />
      <Payment />
      <ShareGroup />
      <AddCommunity />
      <JoinCommunityModal />
    </>
  )
}

export default observer(Modals)
