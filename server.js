//HAVE TO HAVE

// expire regCodes after 1 hr, add 'no regcode' case to data that authenticateDevice returns to provider
// set mongodb subscriptionExpiration time based on post to authenticateDevice

//NICE TO HAVE
// user account auth layer


//quick last method for arrays
Array.prototype.last = Array.prototype.last || function() {
	var l = this.length;
	return this[l - 1];
}

//requires


//generates UUIDs
var uuid = require('node-uuid');


//REST server for API
var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());

//database interface
var mongoose = require('mongoose');
mongoose.set('debug', true)
var config = require('./config');
//connect to the database
db = mongoose.connect(config.creds.mongoose_auth_local);

// extend = require('mongoose-schema-extend');

// var User = require('./schema/User');

// var passport = require('passport')
//   , LocalStrategy = require('passport-local').Strategy;
// // // CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



Schema = mongoose.Schema;


//define what our record looks like
var RecordSchema = new Schema({

	deviceID: {
		type: String,
		unique: true
	},
	dateCreated: Date,
	uuid: String,
	regCode: String,
	regCodeExpiration:Date,
	authorized: String,
	message: String,
	subscriptionExpiration: Date,
	//to autoExpire a document
	// createdAt: {
	// 	type:Date,
	// 	expires:'1m'
	// },
});



var Record = mongoose.model('record', RecordSchema);


function getRecords(req, res, next) {
	//responds with all of the records -- for development 
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	Record.find().sort('dateCreated').execFind(function(arr, data) {
		res.send(data);
	})
};

function recordExists(req, res, next) {
	//checks to see if a record exists, so that we know whether to create a new device or check authorization for this one
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	var device = req.params.deviceID;
	Record.findOne({
		deviceID: device
	}, 'uuid', function(err, data) {

		if (err) {
			return handleError(err)
		} else {
			if (data !== null && typeof data !== 'undefined') {
				res.send(data);
			} else {
				res.send({
					exists: false
				})
			}


		}
	})


}

function checkAuthorization(req, res, next) {
	//checks to see if a device is authorized, so that client can poll & change state
	//$.post('http://localhost:8080/checkAuthorization',{deviceID:"someDevice"})
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	var device = req.params.deviceID;
	Record.findOne({
		deviceID: device
	}, 'authorized', function(err, data) {

		if (err) {
			return handleError(err)
		} else {
			if (data !== null && typeof data !== 'undefined') {
				res.send(data);
			} else {
				res.send({
					authorized: false
				})
			}


		}
	})


}


function authenticateDevice(req, res, next) {
	//authenticates the device using a regcode to change its auth status in the database
	//$.post('http://localhost:8080/authenticateDevice',{regCode:"439cfb1"})

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	var regCode = req.params.regCode;
	Record.findOne({
		regCode: regCode
	}, 'authorized', function(err, data) {

		if (err) {
			return handleError(err)
		} else {
			if (data !== null && typeof data !== 'undefined') {
				//success case
				console.log(data);
				console.log('auth:', data.authorized);
				data.authorized = "authorized";
				console.log('auth:', data.authorized);
				data.save();
				res.send(data);

			} else {
				//no data case
				res.send({authorized:'No such regCode'})
			}


		}
	})


}



function postRecord(req, res, next) {
	//creates a new record using the deviceID in the client request
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	var record = new Record();
	record.authorized = "unauthorized";
	var saveRecord = function() {
		record.save(function() {

			res.send(req.body);
		});
	}
	if (typeof req.params.deviceID !== 'undefined') {
		console.log(req.params.deviceID);
	};
	if (typeof req.params.message !== 'undefined') {
		record.message = req.params.message;
		record.dateCreated = new Date();

		record.uuid = uuid.v4();

		///generate a regcode
		var regCode = record.uuid.split('-')[0].substring(0, 3) + record.uuid.split('-').last().substring(0, 4)
		record.regCode = regCode;

		record.deviceID = req.params.deviceID;

		//set an expiration for the regcode

		function setExpiration(days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = date.toGMTString();
			}
			return expires
		}

		var expiration = setExpiration(1)
		record.regCodeExpiration = expiration;

		//could create a new doc with the regcode and delete it automatically after a set time, based on the schema above
		//record.createdAt= new Date();

		saveRecord()
	}


};



function deleteDevice(req, res, next) {
	//deletes a device from the database.  the whole device record.  so use sparingly!  a.k.a. "unlink"

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	var deviceID = req.params.deviceID;
	Record.remove({
		deviceID: deviceID
	}, function(err) {
		if (err) return handleError(err);
		// removed!
	});
	console.log('DELETED DEVICE: ', deviceID)

}

//routes
server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});
server.get('/records', getRecords);
server.post('/records/:deviceID', postRecord);
server.post('/records', postRecord);
server.post('/exists', recordExists);
server.post('/checkAuthorization', checkAuthorization);
server.post('/authenticateDevice', authenticateDevice);
server.post('/deleteDevice', deleteDevice);



///serve the client also during dev

var connect = require('connect'),
	http = require('http');

var app = connect()
	.use(connect.favicon())
	.use(connect.logger('dev'))
	.use(connect.static('public'))
	.use(connect.directory('public'))
	.use(connect.cookieParser())
	.use(connect.session({
	secret: 'my secret here'
}))
	.use(function(req, res) {
	res.end('Hello from Connect!\n');
});

http.createServer(app).listen(3001);