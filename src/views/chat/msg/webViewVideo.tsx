import React, { useState } from 'react'
import { Dimensions, View, Text } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { WebView } from 'react-native-webview'

type WebViewVideoProps = {
  embedLink: string
  squareSize?: number
  onLongPress: () => void
}

const { width, height } = Dimensions.get('screen')

const WebViewVideo: React.FC<WebViewVideoProps> = ({ embedLink, onLongPress, squareSize }) => {
  const [isLoading, setIsLoading] = useState(true)
  return !!embedLink ? (
    <>
      <View style={{ width: squareSize || 640, height: squareSize || 170 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/** This can't be a ternary as seen we need the
           * webView loading while we displays the activityIndicator
           */}
          {isLoading && (
            <ActivityIndicator
              animating={true}
              size='large'
              style={{ width: squareSize || 280 }} // 280 is the maxWidth defined at <MsgBubble>
            />
          )}
          <WebView
            // This code will serve as an observer to long press actions in the webview so we can trigger the modal
            // in the react native side using injectedJavaScript + onMessage props
            injectedJavaScript={`
          (() => {
            let setTimeoutID
            document.addEventListener("touchstart", function(event) {
              setTimeoutID = setTimeout(() => {
                setTimeoutID = null
                window.ReactNativeWebView.postMessage("longPress")
                event.preventDefault()
              }, 450)
            })
            document.addEventListener("touchend", function(event) {
              if (setTimeoutID) {
                clearTimeout(setTimeoutID)
                return
              }
              event.preventDefault()
            });
          })()
          (() => {
            const style = document.createElement('style')
            style.type = 'text/css'
            style.appendChild(document.createTextNode("body {-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}"))
            document.head.appendChild(style)
          })()
        `}
            onMessage={(event) => {
              if (event.nativeEvent.data === 'longPress') onLongPress()
            }}
            javaScriptEnabled={true}
            source={{ uri: embedLink }}
            style={{ width: squareSize || 280, height: squareSize || 150 }}
            onLoadEnd={() => setIsLoading(false)}
            originWhitelist={['*']}
          />
        </View>
      </View>
    </>
  ) : null
}

export default WebViewVideo
