import Mongoose from 'mongoose';

interface Person {
  name: string;
  motto: string;
  address: {
    street: string;
    city: string;
  };
  cats: Array<Cat>;
}

interface Cat {
  name: string;
  age: number;
}

export interface User {
  name: string;
  userId: string;
}

const personSchema = new Mongoose.Schema<Person>({
  name: {type: String, required: true},
  motto: {type: String},
  address: {
    street: {type: String},
    city: {type: String},
  },
  cats: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Cat',
    },
  ],
});

const catSchema = new Mongoose.Schema<Cat>({
  name: {type: String, required: true},
  age: {type: Number, required: true},
});

const userSchema = new Mongoose.Schema<User>({
  name: {type: String, required: true},
  userId: {type: String, required: true},
});

const PersonModel = Mongoose.model<Person>('Person', personSchema);
const CatModel = Mongoose.model<Cat>('Cat', catSchema);
const UserModel = Mongoose.model<User>('User', userSchema);

const PersonValidationSchema = {
  _id: {type: 'string'},
  motto: {type: 'string'},
  address: {
    type: 'object',
    properties: {
      street: {type: 'string'},
      city: {type: 'string'},
    },
  },
  name: {type: 'string'},
  cats: {type: 'array', items: {}},
};

const CatValidationSchema = {
  _id: {type: 'string'},
  name: {type: 'string'},
  age: {type: 'number'},
};

const UserValidationSchema = {
  _id: {type: 'string'},
  name: {type: 'string'},
  userId: {type: 'string'},
};

export {
  PersonModel,
  CatModel,
  UserModel,
  PersonValidationSchema,
  CatValidationSchema,
  UserValidationSchema,
};
