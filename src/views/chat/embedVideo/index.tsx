import React from 'react'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { useTheme } from 'store'
import { EmbedVideoProps } from './type'
import Header from './header'
import Footer from './footer'
import Form from './form'

const EmbedVideo = React.forwardRef<Modalize | null, EmbedVideoProps>(
  ({ onSendEmbedVideo }, embedVideoModalRef) => {
    const theme = useTheme()

    return (
      <Portal>
        <Modalize
          ref={embedVideoModalRef}
          adjustToContentHeight
          HeaderComponent={Header}
          FooterComponent={Footer}
          modalStyle={{ backgroundColor: theme.main }}
        >
          <Form onSubmit={onSendEmbedVideo} />
        </Modalize>
      </Portal>
    )
  }
)

export default EmbedVideo
