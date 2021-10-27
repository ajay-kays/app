import React from 'react'
import { Portal, Dialog } from 'react-native-paper'
import { useTheme } from 'store'

export default function DialogWrap({
  title = '',
  dismissable = true,
  visible,
  onDismiss,
  children,
  minH = 200,
  round = 5,
  ph = 12,
}) {
  const theme = useTheme()
  return (
    <Portal>
      <Dialog
        dismissable={dismissable}
        visible={visible}
        onDismiss={onDismiss}
        style={{
          backgroundColor: theme.bg,
          minHeight: minH,
          borderRadius: round,
          paddingHorizontal: ph,
        }}
      >
        <Dialog.Title
          style={{
            color: theme.primary,
            fontWeight: '400',
            paddingHorizontal: 0,
            marginHorizontal: ph,
          }}
        >
          {title}
        </Dialog.Title>
        <Dialog.Content
          style={{
            paddingHorizontal: ph,
          }}
        >
          {children}
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}
