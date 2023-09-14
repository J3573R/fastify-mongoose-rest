import {Types, Schema, model} from 'mongoose';

export interface Person {
  name: string;
  motto: string;
  address: {
    street: string;
    city: string;
  };
  cats?: Array<Cat>;
}

export interface Cat {
  name: string;
  age: number;
  owner: Person | Types.ObjectId;
}

export interface User {
  name: string;
  userId: string;
}

const personSchema = new Schema<Person>(
  {
    name: {type: String, required: true},
    motto: {type: String},
    address: {
      street: {type: String},
      city: {type: String},
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

personSchema.virtual('cats', {
  ref: 'Cat',
  localField: '_id',
  foreignField: 'owner',
});

const catSchema = new Schema<Cat>({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  owner: {type: Schema.Types.ObjectId, ref: 'Person'},
});

const userSchema = new Schema<User>({
  name: {type: String, required: true},
  userId: {type: String, required: true},
});

const PersonModel = model<Person>('Person', personSchema);
const CatModel = model<Cat>('Cat', catSchema);
const UserModel = model<User>('User', userSchema);

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
  cats: {type: ['array', 'null'], items: {}},
};

const CatValidationSchema = {
  _id: {type: 'string'},
  name: {type: 'string'},
  age: {type: 'number'},
  owner: {
    type: ['string', 'object'],
    properties: PersonValidationSchema,
  },
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
