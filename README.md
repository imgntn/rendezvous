<i><b>To-Do:</b> An example of a user registration/login module and example front-end UI</i><br><br>
<h1><b>Reference Rendezvous Implementation<br></b></h1>
by James B. Pollack<br>
A Different Engine<br><br>
This pattern is used to link a device, such as a Smart TV or Roku, with a particular user account.  It minimizes user input on the device itself due to limited input modalities. <br>

<b>Table of Contents</b><br>
Pattern<br>
Prerequisites<br>
Setup (1,2,3)<br>
Using (1,2,3,4,5,6)<br>
Screenshots<br>

<b>The pattern:<br>

--The client requests a registration code from the server by sending it a device ID.<br>
--The server generates a registration code and returns it to the client.<br>
--The client displays the code to the user.<br>
--The user enters their account information, along with the registration code, on the provider website.<br>
--The provider verifies the account and sends a message to the server with the registration code and an expiration date for the subscription.<br>
--The server associates the registration code with the device ID and authorizes the subscription.<br>
--The client polls the server until it recieves authorization and changes state*.<br>
--The database will use its expiration functions to purge both old registration codes and old subscriptions.<br>
<br>
*[I would like to replace this step with a socket to prevent unnecessary polling, but device support is not yet robust.<br>



<b>Prerequisites:<br></b>
server: node.js -- see below for installation notes<br>
database: mongodb -- see below for installation notes<br>
node modules: <br>
//REST API, middleware, database interface, uuid generator<br>
restify<br>
connect<br>
mongoose<br>
mongoose-ttl<br>
node-uuid<br><br>
//user auth stuff, not needed yet<br>
bcrypt<br>
passport<br>
passport-local<br>
passport-local-mongoose<br><br>



<b>Setup #1 -- Installing node.js</b><br>
Use package installer at http://nodejs.org/

<b>Setup #2 -- Installing mongoDB (OS X)

-1. download from http://www.mongodb.org/dr/fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.4.3.tgz/download<br>
-2. extract the contents to /usr/local/mongodb<br>
-3. cd /usr/local/mongodb and run the following commands<br>

$ sudo mkdir -p /data/db<br>
$ whoami<br>
jpollack<br>
$ sudo chown jpollack /data/db<br>

-4. run the following commands to add mongo to your path<br>
vi ~/.profile (or ~/.bash_profile) and add the following<br>
export MONGO_PATH=/usr/local/mongodb<br>
export PATH=$PATH:$MONGO_PATH/bin

-5. open a new tab and type in mongo -version<br> 
-5.1 mongod (starts server)<br>

-6 open a new tab and type in mongo (starts client)<br> 
-6.1 type show dbs -> shows local (empty)<br>
-6.2 type use rdzv (or call it whatever you want by typing use yourDatabaseName.  <br>*Be sure to change the config.js file below to match this*<br>
-6.3 type db.users.save({username:'username'});<br>
-6.4 type show dbs -> should now show rdvz<br>

-7. to setup auto start http://www.mkyong.com/mongodb/how-to-install-mongodb-on-mac-os-x/

<b>Setup # 3 --  Installing node.js packages</b> (inside rendezvous folder)<br>

npm install restify connect mongoose mongoose-ttl node-uuid <br>
<i>proper package file will be forthcoming</i>

<b>Using # 1 --To start the server:</b> (inside rendezvous folder)<br>
copy sampleconfig.js to config.js and set it up so it points to mongodb://localhost/yourDatabaseName i.e. mongodb://localhost/rdzv<br>
node server.js
This will run servers on two ports right now, 8081 (the server) and 3001 (the client)

<b>Using # 2 -- To register a device from the client:</b><br>
visit http://localhost:3001 and run mainClient.init('your_deviceID') in your Javascript console (or programatically)<br>
*where your_deviceID is the unique identifier of the device<br>

<b>Using # 3 -- To send an authorization for a device to the server after provider authorization of the user account</b><br>
$.post('http://localhost:8081/authenticateDevice',{regCode:'Your_regCode'})<br>
*where your_regCode is the regCode provided to the user<br>

<b>Using # 4 -- Client-side Authorization State Change</b><br>
You'll see that mainClient.authorized is false when the client is not authorized, but changes to true when the polling returns an authorized parameter.  Use this flag to drive behavior on the client.

<b>Using # 5 -- Client-side UI</b><br>
You'll need at least two elements on the Link Account Page:  a "New Registration Code" button and an "Unlink Device" button<br>
There are two client-side methods for this:<br>
mainClient.unLinkDevice(deviceID)<br>
mainClient.generateRegCode(deviceID)<br>

<b>Using # 5 -- Admin Functions</b><br>
To see all active Records, go to http://localhost:8081/records
To see all active regCodes, go to http://localhost:8081/regcodes
