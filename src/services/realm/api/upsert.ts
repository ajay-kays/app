import { display } from 'lib/logging'
import { realm } from './realm.instance'
import { Update } from './types/update.interface'

/**
 * Update function
 * @param {string} props.schema - Name of schema where data will be updated
 * @param {number} props.id - Id of the object that will be modified
 * @param {object | any} props.body - Object with the structure of the schema
 */
export default (props: Update) => {
  const { schema, id = 1, body } = props
  // display({
  //   name: 'realm UPSERT',
  //   preview: 'In realm UPSERT with...',
  //   important: true,
  //   value: { props, schema, id, body },
  // })
  let response: any = null
  try {
    const existsObject = realm.objectForPrimaryKey(schema, id)
    // display({
    //   name: 'realm UPSERT',
    //   preview: `EXISTS OBJECT ${schema} ID ${id}??`,
    //   important: true,
    //   value: { existsObject },
    // })

    if (!existsObject) {
      realm.write(() => {
        response = realm.create(schema, body)
        console.log(`Created object in schema: ${schema}`)
        // console.log('response: ', response)
      })
    }

    // realm.write(() => {
    //   // console.log(`Updating object in schema: ${schema}`);
    //   response = realm.objects(schema).find((e: any) => e.id === id)
    //   if (schema === 'Msg') response = realm.objects(schema)[0]
    //   const availableFields: any[] = []
    //   for (let key in response) availableFields.push(key)
    //   let hasEqualBody = true

    //   Object.keys(body).forEach((key: string) => {
    //     if (!availableFields.includes(key)) {
    //       console.log(`Invalid key: ${key} trying to update schema ${schema}`)
    //       hasEqualBody = false
    //       response = null
    //     }
    //   })

    //   if (hasEqualBody) {
    //     if (schema !== 'Msg') Object.assign(response, body)
    //     if (schema === 'Msg') {
    //       response.messages = body.messages
    //       response.lastSeen = body.lastSeen
    //       response.lastFetched = body.lastFetched
    //     }
    //     // if (schema === 'Msg') console.log('updatedObject: ', response.messages.length);
    //     // if (schema !== 'Msg') console.log('updatedObject: ', response);
    //   }
    // })
    return response
  } catch (e) {
    console.log(`Error on update the schema: ${schema}`)
    console.log(`id: ${id}`)
    console.log(`body: ${body}`)
    console.log(`error: ${e}`)
    return e
  }
}

// import { display } from 'lib/logging'
// import create from './create'
// import { realm } from './realm.instance'
// import { Update } from './types/update.interface'

// /**
//  * Update function
//  * @param {string} props.schema - Name of schema where data will be updated
//  * @param {number} props.id - Id of the object that will be modified
//  * @param {object | any} props.body - Object with the structure of the schema
//  */
// export default (props: Update) => {
//   const { schema, id, body } = props
//   display({
//     name: 'realm update',
//     preview: 'In realm update with...',
//     important: true,
//     value: { props, schema, id, body },
//   })
//   let response: any = null
//   try {
//     realm.write(() => {
//       console.log(`Updating object in schema: ${schema}`)
//       if (schema === 'Msg') {
//         console.log('yeah so fuckin wut:')
//         // let thiswat = realm.objects(schema)
//         // console.log('wat:', thiswat)
//         response = realm.objects(schema)[0]
//         response.messages = body.messages
//         response.lastSeen = body.lastSeen
//         response.lastFetched = body.lastFetched
//         console.log('SET?')
//         // display({
//         //   name: 'realm update',
//         //   preview: 'response so far nah',
//         //   important: true,
//         //   // value: { response },
//         // })
//         // console.log('SO:', response)
//       } else {
//         response = realm.objects(schema).find((e: any) => e.id === id)
//       }

//       const availableFields: any[] = []
//       for (let key in response) availableFields.push(key)
//       let hasEqualBody = true

//       Object.keys(body).forEach((key: string) => {
//         if (!availableFields.includes(key)) {
//           console.log(`Invalid key: ${key} trying to update schema ${schema}`)
//           // console.log('BUT SKIPPING OVERWRITES...')
//           hasEqualBody = false
//           response = null
//         }
//       })

//       // if (schema === 'Msg' && response === null) {
//       //   display({
//       //     name: 'realm update',
//       //     preview: 'SOME MSG SCHEMA PROBLEM, RETRY CREATE?',
//       //     important: true,
//       //     value: { response },
//       //   })
//       //   create({ schema, body })
//       //   display({
//       //     name: 'realm update',
//       //     preview: 'created?',
//       //     important: true,
//       //     value: { response },
//       //   })
//       //   console.log('created?')
//       // }

//       if (!response) {
//         response = {}
//       }

//       if (hasEqualBody) {
//         if (schema !== 'Msg') Object.assign(response, body)
//         if (schema === 'Msg') {
//           response.messages = body.messages
//           response.lastSeen = body.lastSeen
//           response.lastFetched = body.lastFetched
//         }
//         // if (schema === 'Msg') console.log('updatedObject: ', response.messages.length);
//         // if (schema !== 'Msg') console.log('updatedObject: ', response);
//       }
//     })
//     return response
//   } catch (e) {
//     console.log(`Error on update the schema: ${schema}`)
//     console.log(`id: ${id}`)
//     console.log(`body: ${body}`)
//     console.log(`error: ${e}`)
//     return e
//   }
// }
