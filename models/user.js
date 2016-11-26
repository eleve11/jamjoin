import mongoose from 'mongoose';

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: String,
	lastname: String,
	age: Number,
	tags: [String],
	room: String
})

module.exports = mongoose.model("User", UserSchema);