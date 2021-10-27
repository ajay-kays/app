import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper'
import { useTheme } from 'store'

export default function ModalWrap(props) {
  const {
    visible,
    onClose,
    noHeader,
    noSwipe,
    swipeDirection,
    hasBackdrop,
    animationInTiming,
    animationOutTiming,
    coverScreen,
    fullscreen,
    animationIn,
    animationOut,
    children,
  } = props
  const theme = useTheme()

  const paddingTop = noHeader ? 0 : fullscreen ? getStatusBarHeight() : 0

  return (
    <Modal
      isVisible={visible}
      style={{
        ...styles.modal,
        justifyContent: fullscreen ? 'center' : 'flex-end',
      }}
      onSwipeComplete={() => onClose()}
      swipeDirection={noSwipe ? null : swipeDirection}
      onBackButtonPress={() => onClose()}
      hasBackdrop={hasBackdrop}
      animationIn={animationIn}
      animationOut={animationOut}
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      propagateSwipe={props.propagateSwipe ? true : false}
      swipeThreshold={20}
      coverScreen={coverScreen}
      // deviceHeight={h}
      // useNativeDriver={true}
      // statusBarTranslucent={true}
    >
      <View
        style={{
          ...styles.main,
          backgroundColor: theme.bg,
          height: fullscreen ? '100%' : 200,
          paddingTop,
        }}
      >
        {children}
      </View>
    </Modal>
  )
}

ModalWrap.defaultProps = {
  animationInTiming: 400,
  animationOutTiming: 400,
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  swipeDirection: 'down',
  coverScreen: true,
  fullscreen: true,
  hasBackdrop: true,
  noHeader: false,
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
  },
  main: {
    borderTopLeftRadius: isIphoneX() ? 20 : 0,
    borderTopRightRadius: isIphoneX() ? 20 : 0,
  },
})
