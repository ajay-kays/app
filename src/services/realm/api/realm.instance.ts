import Realm from 'realm'
import {
  msgSchema,
  chatsSchema,
  messageSchema,
  messageNewSchema,
  contactsSchema,
  lastSeenSchema,
  statusMapSchema,
} from '../models'

import * as exampleSchemas from '../models/example.schema'

/**
 * Create a new instance of realm with all the model schemas
 */
export const realm = () => {}
// export const realm = new Realm({
//   schema: [
//     // exampleSchemas.CatSchema,
//     // exampleSchemas.DogSchema,
//     // exampleSchemas.PersonSchema,
//     // exampleSchemas.TaskSchema,
//     lastSeenSchema,
//     statusMapSchema,
//     chatsSchema,
//     contactsSchema,
//     messageSchema,
//     msgSchema,
//     messageNewSchema,
//   ],
// })
