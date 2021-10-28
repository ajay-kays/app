import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { useTheme } from 'store'
import Icon from '../Icon'

export default function ActionMenu({ items }) {
  const theme = useTheme()

  return (
    <>
      {items.map((subItems, index) => (
        <View key={index} style={{ ...styles.wrap, backgroundColor: theme.bg }}>
          {subItems.map((item, i) => {
            const iconProp = React.isValidElement(item.thumbIcon)

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={`${item.title}${i}`}
                style={{
                  ...styles.row,
                  borderTopWidth: i !== 0 ? 0.5 : 0,
                  borderColor: theme.border,
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
                  <Text style={{ fontSize: 16, color: theme.text }}>{item.title}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.preview && (
                    <Text style={{ ...styles.previewText, color: theme.accent }}>
                      {item.preview}
                    </Text>
                  )}
                  <Icon name={item.icon} color={theme.icon} size={25} />
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 10,
    paddingRight: 18,
    paddingLeft: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  previewText: {
    fontSize: 16,
    marginRight: 5,
  },
  thumbWrapper: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    borderRadius: 10,
    height: 70,
    width: 70,
    marginRight: 20,
  },
})
