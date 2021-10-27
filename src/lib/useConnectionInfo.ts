import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'

const useConnectionInfo = () => {
  const [connection, setConnection] = useState(true)

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      setConnection(state.isConnected as boolean)
    })
    return removeNetInfoSubscription
  }, [])

  return connection
}

export default useConnectionInfo
