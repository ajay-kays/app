export const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'int',
    name: 'string',
    priority: 'int?',
    progressMinutes: 'int?',
  },
  primaryKey: '_id',
}

export const PersonSchema = {
  name: 'Person',
  properties: {
    name: 'string',
    age: 'int?',
  },
}

export const DogSchema = {
  name: 'Dog',
  properties: {
    name: 'string',
    owner: 'Person?',
    age: 'int?',
  },
}

export const CatSchema = {
  name: 'Cat',
  properties: {
    name: 'string',
  },
}
