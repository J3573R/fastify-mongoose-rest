const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model('user', schema);
