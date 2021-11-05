import React, { ErrorInfo } from 'react'
import { Text, Button, TextStyle, View, ViewStyle, ScrollView, ImageStyle } from 'react-native'
// import Button from 'components/common/Button'
// import Text from 'components/common/Typography'

const CONTAINER: ViewStyle = {
  // alignItems: 'center',
  flex: 1,
  padding: 16,
  paddingVertical: 50,
  backgroundColor: 'white',
}

const ERROR_DETAILS_CONTAINER: ViewStyle = {
  width: '100%',
  maxHeight: '60%',
  backgroundColor: 'white',
  marginVertical: 15,
  paddingHorizontal: 10,
  paddingBottom: 15,
  borderRadius: 6,
}

const BTN_RESET: ViewStyle = {
  paddingHorizontal: 40,
  backgroundColor: 'blue',
}

const TITLE_ERROR: TextStyle = {
  color: 'red',
  fontWeight: 'bold',
  paddingVertical: 15,
  marginTop: 30,
  textAlign: 'center',
}

const FRIENDLY_SUBTITLE: TextStyle = {
  color: 'black',
  fontWeight: 'normal',
  paddingVertical: 15,
  textAlign: 'left',
}

const CONTENT_ERROR: TextStyle = {
  color: 'red',
  fontWeight: 'bold',
  paddingVertical: 15,
}

// Uncomment this and the Text component in the ErrorComponent if
// you want to see a backtrace in your error reporting screen.
const CONTENT_BACKTRACE: TextStyle = {
  color: 'red',
}

const ICON: ImageStyle = {
  marginTop: 30,
  width: 64,
  height: 64,
}

export interface ErrorComponentProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

/**
 * Describe your component here
 */
export const ErrorSimple = (props: any) => {
  return (
    <View style={CONTAINER}>
      <Text style={TITLE_ERROR}>App Error :(</Text>
      <Text style={FRIENDLY_SUBTITLE}>Oops! The app crashed.</Text>
      <Text style={FRIENDLY_SUBTITLE}>
        The issue has been reported to developers. Please try again later.
      </Text>
      <Text style={FRIENDLY_SUBTITLE}>
        You may be able to get around the error by closing and reopening your app.
      </Text>
      <View style={ERROR_DETAILS_CONTAINER}>
        <ScrollView>
          <Text style={{ color: 'red' }}>{JSON.stringify(props)}</Text>
        </ScrollView>
      </View>
      {/* <Button style={BTN_RESET} onPress={props.onReset} tx='errorScreen.reset' /> */}
    </View>
  )
}
