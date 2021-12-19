/**
 * TEST Message model for realm
 */
export default {
  name: 'MessageNew',
  properties: {
    id: { type: 'int', default: null, optional: true },
    chat_id: { type: 'int', default: null, optional: true },
    message_content: { type: 'string', default: null, optional: true },
  },
}
