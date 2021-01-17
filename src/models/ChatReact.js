const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatReactSchema = new Schema({
  user: String,
  text: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatReact', ChatReactSchema);
