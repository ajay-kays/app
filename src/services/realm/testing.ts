import { display } from 'lib/logging'
import { get } from './api'
import { realm } from './api/realm.instance'

export const testRealm = () => {
  console.log('skipping')
  // Declare the variable that will hold the dog instance.
  // let dog
  // Open a transaction.
  // realm.write(() => {
  //   // Assign a newly-created instance to the variable.
  //   // dog = realm.create('Dog', { name: 'Max', age: 5 })

  //   const dog = realm.objects('Dog')[0]
  //   console.log('dog?', dog)
  //   // Update some properties on the instance.
  //   // These changes are saved to the realm.
  //   dog.name = 'MaximilianBobo'
  //   dog.age += 1
  //   console.log('updated dog age?', dog.age)
  // })
  // // use newly created dog object
  // // console.log('Sup dog:', dog)

  // const dogs = realm.objects('Dog')
  // console.log('Number of dogs:', dogs.length)
  // // filter for tasks with a high priority
  // const olderDogs = dogs.filtered('age > 5')
  // console.log('Number of dogs older than 5:', olderDogs.length)

  // // retrieve the set of Task objects
  // const tasks = realm.objects('Task')
  // // filter for tasks with a high priority
  // const highPriorityTasks = tasks.filtered('priority > 5')
  // // filter for tasks that have just-started or short-running progress
  // const lowProgressTasks = tasks.filtered('1 <= progressMinutes && progressMinutes < 10')
  // console.log(
  //   `Number of high priority tasks: ${highPriorityTasks.length} \n`,
  //   `Number of just-started or short-running tasks: ${lowProgressTasks.length}`
  // )

  // console.log('ok...?')
}

export const testRealm2 = () => {
  const messages = realm.objects('MessageNew')
  console.log(`There are ${messages.length} messages`)

  realm.write(() => {
    // Add a new person to the realm. Since nobody with ID 1234
    // has been added yet, this adds the instance to the realm.
    let message = realm.create(
      'MessageNew',
      { _id: 1, id: 1, chat_id: 1, message_content: 'Super test message content' },
      'modified'
    )
    console.log(message)
  })

  // messages.values()
  console.log('messages:', messages.values())
  // const contacts: any = get({ schema: 'Contacts' })
  // const chats: any = get({ schema: 'Chats' })
  // const messages: any = get({ schema: 'Message' })
  // const msg: any = get({ schema: 'Msg' })
  // This works, theres just some problem with toJSON...
  // const messages = realm.objects('Message')
  // console.log(`There are ${messages.length} messages`)
  // const calicoCats = messages.filtered("id == '15'")
  // console.log(`There are ${calicoCats.length} messages w id 15`)
  // console.log(calicoCats.toJSON())
  // const realmMsg = get({ schema: 'Message' })
  // const parsedData = JSON.parse(JSON.stringify(realmMsg))
  // display({
  //   name: 'testRealm',
  //   value: { messages }, //{ contacts, chats, msg, messages },
  //   preview: 'Test realm gets',
  //   important: true,
  // })
}
