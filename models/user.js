var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    email: {
	type: String,
	unique: true,
	required: true,
	trim: true
    },
    username: {
	type: String,
	required: true,
	trim: true 
    },
    password: {
	type: String,
	required: true
    }
});
var User = mongoose.model('User', UserSchema);
// hash password before saving it to database using `pre` method
UserSchema.pre('save', function(next){
    // `this`, in this context, refers to the object we created containing the
    // information the user entered in the sign up form
    let user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
	if (err) {
	    return next(err);
	}
	user.password = hash;
	next();
    });
});
module.exports = User;
