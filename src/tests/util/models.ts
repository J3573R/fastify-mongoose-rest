import Mongoose from 'mongoose';

interface Person {
  name: string;
}

interface Cat {
  name: string;
  age: number;
  owner?: Person;
}

const personSchema = new Mongoose.Schema<Person>({
  name: {type: String, required: true},
});

const catSchema = new Mongoose.Schema<Cat>({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Person',
  },
});

const PersonModel = Mongoose.model<Person>('Person', personSchema);
const CatModel = Mongoose.model<Cat>('Cat', catSchema);

const PersonValidationSchema = {
  _id: {type: 'string'},
  name: {type: 'string'},
};

const CatValidationSchema = {
  _id: {type: 'string'},
  name: {type: 'string'},
  age: {type: 'number'},
  person: {
    type: 'object',
    properties: PersonValidationSchema,
  },
};

export {PersonModel, CatModel, PersonValidationSchema, CatValidationSchema};
