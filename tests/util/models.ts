import Mongoose from 'mongoose';

interface Person {
  name: string;
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

const personSchema = new Mongoose.Schema<Person>({
  name: {type: String, required: true},
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

const PersonModel = Mongoose.model<Person>('Person', personSchema);
const CatModel = Mongoose.model<Cat>('Cat', catSchema);

const PersonValidationSchema = {
  _id: {type: 'string'},
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

export {PersonModel, CatModel, PersonValidationSchema, CatValidationSchema};
