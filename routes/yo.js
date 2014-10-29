var mongoose = require('mongoose')
var Yo = require('yo-api');
var yo = new Yo(YO_AUTH_TOKEN_HERE);

// Schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	yoUsername: String,
	currentLoc: String,
	endLoc: String,
	currentItinerary: Array
});
var User = mongoose.model('User', UserSchema);

// Route
module.exports = function(app){
	app.post('/yo/newUser/', function(req, res){ // Registration on web
		var usrObj = {
			yoUsername: req.body.username,
			currentLoc: req.body.currentLoc || "",
			endLoc: req.body.endLoc || ""
		};
		console.log(req.body.username);
		User.create(usrObj, function(err, newUser){
			if (err){
				console.log("Error: " + err);
				res.json({userCreateError: err.message});
			} else {
				yo.yo(newUser.yoUsername, function(err, yoRes, body){
					if (err){
						res.json({sendYoError: err.message});
					} else {
						res.json({success: "User " + newUser.yoUsername + " successfully created."});
					}
				});
			}
		});
	});

	app.get('/yo/update/', function(req, res){
		var usrObjUpdate = {
			currentLoc: req.param('location') || "",
			endLoc: req.param('url') || "",
			currentItinerary: req.param('itinerary') || ""
		};

		User.findOneAndUpdate({yoUsername: req.param('username')}, usrObjUpdate, function(err, user){
			if (err) res.json({userUpdateError: err.message});
			// This line will keep me up at night
			if (!req.param('itinerary')) var responseURL = user.currentLoc ? (user.endLoc ? "http://generating-your.yoadtrip" : "http://send-your.destination") : (user.endLoc ? "http://send-your-current.location" : "http://send-your-current-location-and.destination");
			

			yo.yo_link(user.yoUsername, responseURL, function(err, yoRes, body){
				if (err) res.json({sendYoOnUpdateError: err.message});


			});
		});
	});
}