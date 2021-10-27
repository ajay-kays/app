import React from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { useTheme } from 'store'
import Icon from '../Icon'
import Typography from '../Typography'

export default function Menu(props) {
  const { visible, items, hasBackdrop, swipeDirection, onCancel } = props
  const theme = useTheme()

  let actionItems: any[] = []

  if (typeof onCancel === 'function') {
    actionItems = [
      ...items,
      {
        title: 'Cancel',
        thumbIcon: 'Close',
        thumbBgColor: theme.grey,
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
        margin: 0,
        justifyContent: 'flex-end',
      }}
      hasBackdrop={hasBackdrop}
      onSwipeComplete={onCancel}
      onBackdropPress={onCancel}
      swipeDirection={swipeDirection}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View style={styles.headLine} />
      </View>

      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {actionItems.map((item, i) => {
          const iconProp = React.isValidElement(item.thumbIcon)

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={`${item.title}${i}`}
              style={{
                ...styles.row,
                height: item.description ? 60 : 55,
                maxHeight: item.description ? 60 : 55,
              }}
              onPress={item.action}
              disabled={item.disabled}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                <View>
                  <Typography size={16}>{item.title}</Typography>
                  {item.description && (
                    <Typography size={14} color={theme.subtitle}>
                      {item.description}
                    </Typography>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.preview && (
                  <Typography
                    style={{
                      marginRight: 5,
                    }}
                  >
                    {item.preview}
                  </Typography>
                )}
                {item.icon && <Icon name={item.icon} color={theme.icon} size={25} />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </Modal>
  )
}

Menu.defaultProps = {
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
})
