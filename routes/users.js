const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');
const plm=require('passport-local-mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true,unique: true },
  password: { type: String},
  dp: {type:String},
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});
userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);
