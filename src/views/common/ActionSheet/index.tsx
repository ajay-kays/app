import React from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'
import Modal from 'react-native-modal'

import Typography from '../Typography'

const PRIMARY_COLOR = 'rgb(0,98,255)'
const WHITE = '#ffffff'
const BORDER_COLOR = '#DBDBDB'

export default function ActionSheet(props) {
  const { visible, items } = props
  const actionSheetItems = [
    ...items,
    {
      id: '#cancel',
      label: 'Cancel',
      onPress: props?.onCancel,
    },
  ]

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={props.onCancel}
      backdropOpacity={0.2}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}
    >
      <View style={styles.modalContent}>
        {actionSheetItems.map((actionItem, index) => {
          return (
            <TouchableHighlight
              style={[
                styles.actionSheetView,
                index === 0 && {
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                },
                index === actionSheetItems.length - 2 && {
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                },
                index === actionSheetItems.length - 1 && {
                  borderBottomWidth: 0,
                  backgroundColor: WHITE,
                  marginTop: 8,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                },
              ]}
              underlayColor={'#f7f7f7'}
              key={index}
              onPress={actionItem.onPress}
            >
              <Typography
                allowFontScaling={false}
                size={18}
                lh={22}
                color={actionItem?.actionTextColor ? actionItem?.actionTextColor : PRIMARY_COLOR}
              >
                {actionItem.label}
              </Typography>
            </TouchableHighlight>
          )
        })}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
  },
  actionSheetView: {
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_COLOR,
  },
})

ActionSheet.defaultProps = {
  actionItems: [],
  onCancel: () => {},
  actionTextColor: null,
}
