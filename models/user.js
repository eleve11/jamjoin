import mongoose from 'mongoose';

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: String,
	lastname: String,
	tags: Array
})

module.exports = mongoose.model("User", UserSchema);