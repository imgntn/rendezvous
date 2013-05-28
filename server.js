

	//quick last method for arrays
	Array.prototype.last = Array.prototype.last || function() {
    var l = this.length;
    return this[l-1];
}

//requires

var uuid = require('node-uuid');

var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());

var mongoose = require('mongoose');
mongoose.set('debug', true)
var config = require('./config');
db = mongoose.connect(config.creds.mongoose_auth_local);

extend = require('mongoose-schema-extend');

var User = require('./schema/User');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
// // CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




Schema = mongoose.Schema;


var RecordSchema = new Schema({
	deviceID:{type:String,unique:true},
	dateCreated: Date,
	uuid: String,
	regCode:String,
	regCodeExpiration: Date,
	authorized:String,
	message:String,
});



var Record = mongoose.model('record', RecordSchema);


	function getRecords(req, res, next) {

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');

		Record.find().sort('dateCreated').execFind(function(arr, data) {
			res.send(data);
		})
	};

	function recordExists(req,res,next){

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	device = req.params.deviceID;
		Record.findOne({deviceID:device},function(err,data) {
		
		if (err) {return handleError(err)}

			else{
				if(data!==null && typeof data!=='undefined'){
						res.send(data);
				}
				else{
					res.send({exists:false})
				}
			

			}
		})


	}

function postRecord(req, res, next) {

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	var record = new Record();
	var saveRecord = function() {
		record.save(function() {

			res.send(req.body);
		});
	}
	if (typeof req.params.deviceID !== 'undefined'){
console.log(req.params.deviceID);
	};
	if (typeof req.params.message !== 'undefined') {
		record.message = req.params.message;
		record.dateCreated = new Date();
		
		record.uuid = uuid.v4();

///generate a regcode
var regCode = record.uuid.split('-')[0].substring(0,3)+record.uuid.split('-').last().substring(0,4)
record.regCode = regCode;

record.deviceID = req.params.deviceID;

//set an expiration for the regcode
	function setExpiration(days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = date.toGMTString();
    }
    return expires
}

var expiration = setExpiration(1)
record.regCodeExpiration = expiration;


		saveRecord()
	}


};





// //delete by feature match -- 
// Record.remove({ __v: 0 }, function (err) {
//   if (err) return handleError(err);
//   // removed!
// });



//routes
server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});
server.get('/records', getRecords);
server.post('/records/:deviceID',postRecord);
server.post('/records', postRecord);
server.post('/exists', recordExists);




///serve the client also during dev

var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(connect.cookieParser())
  .use(connect.session({ secret: 'my secret here' }))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

http.createServer(app).listen(3000);

