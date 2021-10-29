import React from 'react'
import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../../../store'
import RecDot from '../recDot'
import { styles } from './styles'

type IRecordingBottomBar = { recordingStartTime: string; recordSecs: string }

export const RecordingBottomBar: React.FC<IRecordingBottomBar> = ({ recordingStartTime, recordSecs }) => {
  const theme = useTheme()
  if (!recordingStartTime) return null
  return (
    <>
      <View style={styles.recording}>
        <RecDot />
        <View style={styles.recordSecs}>
          <Text style={{ ...styles.recordSecsText, color: theme.title }}>{recordSecs}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Icon name='rewind' size={16} color='grey' />
          <Text style={{ marginLeft: 5, color: theme.subtitle }}>Swipe to cancel</Text>
        </View>
      </View>
      {/* This is a spinner like, that appears bellow mic icon on recordingBottomBar */}
      <View style={styles.recordingCircle} />
    </>
  )
}
