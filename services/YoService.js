var Yo = require('yo-api');
var yo = new Yo(YO_AUTH_TOKEN_HERE);

module.exports = {
	sendYo: function(user){
		yo.yo(user, function(err, yoRes, body){
			if (err){
				res.json({sendYoError: err.message});
			} else {
				res.json({success: "User " + newUser.yoUsername + " successfully created."});
			}
		});
	},

	sendYoLink: function(user, link){
		yo.yo_link(user, link, function(err, yoRes, body){
			if (err) res.json({sendYoOnUpdateError: err.message});
		});
	}
}