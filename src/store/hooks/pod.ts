import { useMemo } from 'react'
import { Msg } from 'store/msg-store'
import { useStores } from '../index'

export function useMemoizedIncomingPaymentsFromPodcast(podID: string, myid: string | number) {
  const { msg } = useStores()
  return useMemo(() => {
    let earned = 0
    let spent = 0
    let incomingPayments: Msg[] = []
    if (podID) {
      incomingPayments = msg.filterMessagesByContent(0, `"feedID":${podID}`)
      if (incomingPayments) {
        incomingPayments.forEach((m) => {
          if (m.sender !== myid && m.amount) {
            earned += Number(m.amount)
          }
          if (m.sender === myid && m.amount) {
            spent += Number(m.amount)
          }
        })
      }
      // console.log(earned)
    }
    return { earned, spent, incomingPayments }
  }, [podID, myid])
}
