import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs'

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	username: String,
	password: String,
	name: String,
	lastname: String,
	age: Number,
	tags: [String],
	room: String
});

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("User", UserSchema);