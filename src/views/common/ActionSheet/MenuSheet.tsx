import React, { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { useTheme } from 'store'
import Icon from '../Icon'
import Typography from '../Typography'

export default function MenuSheet(props) {
  const { visible, items, hasBackdrop, swipeDirection, onCancel, noSwipe } = props
  const theme = useTheme()
  const [disableAllFunctions, setDisableAllFunctions] = useState(false) // this thing was poorly implemented, requiring double taps to do anything, falsing this for now. --CD

  let actionItems: any[] = []

  if (typeof onCancel === 'function') {
    actionItems = [
      ...items,
      {
        title: 'Cancel',
        action: () => onCancel(),
      },
    ]
  } else {
    actionItems = [...items]
  }

  return (
    <Modal
      isVisible={visible}
      style={{
        marginHorizontal: 0,
        marginVertical: 12,
        justifyContent: 'flex-end',
      }}
      hasBackdrop={hasBackdrop}
      onSwipeComplete={onCancel}
      onBackdropPress={onCancel}
      onModalShow={() => setTimeout(() => setDisableAllFunctions(false), 1000)}
      onModalHide={() => setTimeout(() => setDisableAllFunctions(true), 1000)}
      swipeDirection={noSwipe ? null : swipeDirection}
    >
      {!noSwipe && (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={styles.headLine} />
        </View>
      )}

      <View
        style={{
          ...styles.wrap,
        }}
      >
        {actionItems.map((item, i) => {
          const iconProp = React.isValidElement(item.thumbIcon)

          return (
            <View
              style={[
                i === actionItems.length - 1 && {
                  backgroundColor: theme.dark ? theme.bg : theme.white,
                  marginTop: 12,
                  paddingHorizontal: 64,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  justifyContent: 'center',
                },
              ]}
              key={item.title}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                key={`${item.title}${i}`}
                style={[
                  {
                    backgroundColor: theme.dark ? theme.bg : theme.white,
                    height: item.description ? 70 : 60,
                    maxHeight: item.description ? 70 : 60,
                  },
                  styles.row,
                  styles.actionSheetView,
                  i === 0 && {
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  },
                  i === actionItems.length - 2 && {
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                  // In case of cancel button we should be able to get a different button style, smaller
                  i === actionItems.length - 1 && {
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    justifyContent: 'center',
                  },
                ]}
                onPress={disableAllFunctions ? () => null : item.action}
                disabled={item.disabled}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <>
                    {item.thumbIcon && (
                      <View
                        style={{
                          ...styles.thumbWrapper,
                          backgroundColor: item.thumbBgColor,
                        }}
                      >
                        {iconProp ? (
                          <>{item.thumbIcon}</>
                        ) : (
                          <Icon name={item.thumbIcon} size={18} color={item.thumbColor} />
                        )}
                      </View>
                    )}
                    {item.thumbImage && (
                      <Image
                        source={
                          typeof item.thumbImage === 'string'
                            ? { uri: item.thumbImage }
                            : item.thumbImage
                        }
                        style={{ ...styles.thumbImage }}
                      />
                    )}
                  </>
                  <View>
                    <Typography size={16}>{item.title}</Typography>
                    {item.description && (
                      <Typography size={14} color={theme.subtitle}>
                        {item.description}
                      </Typography>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </Modal>
  )
}

MenuSheet.defaultProps = {
  items: [],
  hasBackdrop: true,
  swipeDirection: 'down',
}

const styles = StyleSheet.create({
  wrap: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingRight: 14,
    paddingLeft: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  thumbWrapper: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    borderRadius: 10,
    height: 70,
    width: 70,
    marginRight: 20,
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#eaeaea',
  },
  actionSheetView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
})
