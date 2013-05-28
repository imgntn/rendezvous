var uuid = require('node-uuid');

var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());

var mongoose = require('mongoose');
mongoose.set('debug', true)
var config = require('./config');
db = mongoose.connect(config.creds.mongoose_auth_local);

extend = require('mongoose-schema-extend');

Schema = mongoose.Schema;

var MessageSchema = new Schema({

	message: String,
	dateCreated: Date,
	expirationDate: Date,
	uuid: String,
	user: String
});



var Message = mongoose.model('message', MessageSchema);

//an extension 
var longMessageSchema = MessageSchema.extend({
	regCode: String
});

var longMessage = mongoose.model('longmessage', longMessageSchema)

	function getMessages(req, res, next) {

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');

		Message.find().sort('Date').execFind(function(arr, data) {
			res.send(data);
		})
	};

function postMessage(req, res, next) {

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	var message = new Message();
	var saveMsg = function() {
		message.save(function() {

			res.send(req.body);
		});
	}
	if (typeof req.params.user !== 'undefined'){
console.log(req.params.user);
	};
	if (typeof req.params.message !== 'undefined') {
		message.message = req.params.message;
		message.dateCreated = new Date();
		

	function setExpiration(days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = date.toGMTString();
    }
    return expires
}
var expiration = setExpiration(30)
message.expirationDate = expiration;


		message.uuid = uuid.v4();
		message.user = req.params.user;

		saveMsg()
	}


};

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});
server.get('/messages', getMessages);
server.post('/messages/:user',postMessage);
server.post('/messages', postMessage);



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

/*
//delete by feature match -- 
Message.remove({ __v: 0 }, function (err) {
  if (err) return handleError(err);
  // removed!
});
*/