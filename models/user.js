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
    },
    pollsHasParticipatedIn: [String]
});

// authenticate input against database documents (The schema's
// `statics` object lets you add methods directly to the model)
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ email: email })
	.exec(function(error, user){
	    if (error) {
		return callback(error);
	    } else if ( !user ) {
		var err = new Error('User not found.');
		err.status = 401;
		return callback(err);
	    }
	    bcrypt.compare(password, user.password, function(error, result) {
		if (result === true) {
		    return callback(null, user);
		} else {
		    return callback();
		}
	    });
	});
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
