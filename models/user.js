var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	username: String,
	password: String,
	name: String,
	lastname: String,
	age: Number,
	tags: [String],
	status: String,
	room: String,
	bio : String
})

module.exports = mongoose.model("User", UserSchema);