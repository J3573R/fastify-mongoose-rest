const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const schema = new Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Mongoose.Types.ObjectId,
    ref: 'user',
  },
  approvers: [{
    type: Mongoose.Types.ObjectId,
    ref: 'user',
  }],
});

module.exports = Mongoose.model('resource', schema);
