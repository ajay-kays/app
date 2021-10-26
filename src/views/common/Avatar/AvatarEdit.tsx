import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Portal, Dialog, ActivityIndicator } from 'react-native-paper'

import { useTheme } from '../../../store'
import Typography from '../Typography'
import Icon from '../Icon'

export default function AvatarEdit({
  display,
  children,
  onPress,
  uploading,
  uploadPercent,
  top = '43%',
  size,
  round = 25,
  percentSize = 14,
}) {
  const theme = useTheme()

  return (
    <TouchableOpacity onPress={onPress} style={styles.imgWrap} activeOpacity={0.6}>
      {children}
      <>
        {uploading && (
          <Typography
            style={{ ...styles.uploadPercent, top: top ? top : '43%' }}
            size={percentSize}
            color={theme.white}
            textAlign='center'
          >{`${uploadPercent}%`}</Typography>
        )}
        {uploading && (
          <View
            style={{
              ...styles.backDrop,
              backgroundColor: theme.transparent,
              width: size,
              height: size,
              borderRadius: round,
            }}
          ></View>
        )}
        {!display && (
          <View style={styles.imgIcon}>
            <Icon name='PlusCircle' fill={theme.primary} color={theme.white} />
          </View>
        )}
        <Portal>
          {/* <Dialog visible={uploading} style={{ backgroundColor: 'transparent' }}>
            <View
              style={{ minHeight: 90, alignItems: 'center', justifyContent: 'center' }}
            >
              <ActivityIndicator color={theme.white} />
              {uploading && (
                <Typography
                  size={20}
                  color={theme.white}
                >{`${uploadPercent}%`}</Typography>
              )}
            </View>
          </Dialog> */}
        </Portal>
      </>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  imgWrap: {
    position: 'relative',
  },
  backDrop: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    fontWeight: '500',
  },
  uploadPercent: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  imgIcon: {
    position: 'absolute',
    right: -5,
    top: '50%',
  },
})
