const mongoose = require('mongoose');
const plm=require('passport-local-mongoose');
mongoose.connect('mongodb+srv://Arijitnaskar12:Arijit*1@cluster0.sugpcsj.mongodb.net/pininterest')
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
