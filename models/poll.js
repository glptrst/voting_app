var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    title: {
	type: String,
	unique: true,
	required: true
    },
    author: {
	type: String
    },
    options: [{
	title: {
	    type: String,
	    required: true
	},
	votes: {
	    type: Number
	}
    }]
});

var Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;
