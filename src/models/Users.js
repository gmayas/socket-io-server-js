const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
  nickName: String,
  position: { lat: Number, lng: Number },
  online: Boolean,
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users', UsersSchema);


/*user req:  {
  nickName: 'Gab',
  position: { lat: 21.1609415, lng: -86.8303498 },
  online: true
}*/