var mongoose = require('mongoose')
var YoService = require('../services/YoService');

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
				YoService.sendYo(newUser.yoUsername);
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

			var responseURL = '';
			// Generates a fake link with a message to send via Yo
			if(!(user.endLoc && user.currentLoc)){
				responseURL += 'http://MissingInfoNeededFor.Itinerary';
			} else {
				response += 'http://Generating.Itinerary';
			}

			YoService.sendYoLink(user.yoUsername, responseURL);
		});
	});
}