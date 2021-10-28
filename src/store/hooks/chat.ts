export function useChatReply(msgs, replyUUID) {
  let replyMessage = msgs && replyUUID && msgs.find((m) => m.uuid === replyUUID)

  return {
    replyMessage,
  }
}
