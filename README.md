<i><b>To-Do:</b> An example of a user registration/login module and example front-end UI; generate fake device id for examples</i><br><br>
<h1><b>Reference Rendezvous Implementation<br></b></h1>
by James B. Pollack - <a href='mailto:james@adifferentengine.com'>james@adifferentengine.com</a> - <a href="http://adifferentengine.com">A Different Engine</a><br><br>
<b>Overview:</b><br>
This pattern is used to link a device, such as a Smart TV or Roku, with a particular user account.  It minimizes user input on the device itself due to limited input modalities. <br>

<h2><b>Table of Contents</b><br></h2>
* The Pattern
* Dependencies
* Setup (1,2,3)
* Using (1,2,3,4,5,6)
* Screenshots

<h3><b>The Pattern:<br></h3>

--The client requests a registration code from the server by sending it a device ID.<br>
--The server generates a registration code and returns it to the client.<br>
--The client displays the code to the user.<br>
--The user enters their account information, along with the registration code, on the provider website.<br>
--The provider verifies the account and sends a message to the server with the registration code and an expiration date for the subscription.<br>
--The server associates the registration code with the device ID and authorizes the subscription.<br>
--The client polls the server until it recieves authorization and changes state*.<br>
--The database will use its expiration functions to purge both old registration codes and old subscriptions.<br>
<br>
*I would like to replace this step with a socket to prevent unnecessary polling, but device support is not yet robust.<br>



<h3><b>Dependencies:</b></h3>
see Setup for installation notes<br>
<b>server:</b> node.js <br>
<b>database:</b> mongodb<br>
<b>node modules: </b> 
restify connect mongoose ms node-uuid (and an included modified local version of mongoose-ttl)
<br>

<!-- //user auth stuff, not needed yet<br>
bcrypt<br>
passport<br>
passport-local<br>
passport-local-mongoose<br><br>
 -->

<h3>Setup:</h3>
<b>Setup #1 -- Installing node.js</b><br>
Use package installer at http://nodejs.org/

<b>Setup #2 -- Installing mongoDB (OS X)

-1. download from http://www.mongodb.org/dr/fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.4.3.tgz/download<br>
-2. extract the contents to <code>/usr/local/mongodb</code><br>
-3. <code>cd /usr/local/mongodb</code> and run the following commands<br>

$ <code>sudo mkdir -p /data/db</code><br>
$ <code>whoami</code><br>
your_User<br>
$ <code>sudo chown your_User /data/db</code><br>

-4. run the following commands to add mongo to your path<br>
vi ~/.profile (or ~/.bash_profile) and add the following<br>
<code>
export MONGO_PATH=/usr/local/mongodb</code><br>
<code>export PATH=$PATH:$MONGO_PATH/bin</code>

-5.1<code>mongod</code> (starts server)<br>

-6 open a new tab and type in <code>mongo</code> (starts client)<br> 
-6.1 type <code> show dbs</code> -> shows local (empty)<br>
-6.2 type <code>use rdzv </code>(or call it whatever you want by typing use yourDatabaseName. Be sure to change the config.js file to match)<br>
-6.3 type <code>db.users.save({username:'username'});</code><br>
-6.4 type <code>show dbs</cod> -> should now show rdvz<br>

-7. to setup auto start on the server http://www.mkyong.com/mongodb/how-to-install-mongodb-on-mac-os-x/

<b>Setup # 3 --  Installing node.js packages</b> (inside rendezvous folder)<br>

<code>npm install restify connect mongoose ms node-uuid </code><br>
<i>proper package file is forthcoming</i><br>

<h3>Using:</h3>
<b>Using # 1 --To start the server:</b> (inside rendezvous folder)
* <code>cp sampleconfig.js config.js </code> 
* edit config.js so it points to <code>mongodb://localhost/yourDatabaseName</code> i.e. mongodb://localhost/rdzv</b><br>
* <code>node server.js</code>  (optionally, a process manager like forever.js is recommended to launch the server)
<br>
This will run servers on two ports right now, 8081 (the server) and 3001 (the client).

To use the dev client, visit <code>http://localhost:3001</code> in a browser.<br>
<b>Using # 2 -- To register a device:</b> (on the client)<br>
 <code>mainClient.init('your_deviceID')</code> <br>
 *where your_deviceID is the unique identifier of the device<br>
 <i>on device this should happen automatically but for dev run it in your javascript console at</i> <code>localhost:3001</code><br>


<b>Using # 3 -- To send an authorization for a device to the server after provider authorization of the user account</b><br>
<code>$.post('http://localhost:8081/authenticateDevice',{regCode:'your_regCode'})</code><br>
*where your_regCode is the regCode provided to the user<br>

<b>Using # 4 -- Client-side Authorization State Change</b> (on the client)<br>
You'll see that <code> mainClient.authorized=false</code>  when the client is not authorized, but <code>mainclient.authorized=false</code> after polling authorizes the device.   Use this flag to drive behavior on the client.

<b>Using # 5 -- Client-side UI</b> (on the client)<br>
Needs at least two button elements on the Link Account Page:  "New Registration Code" and "Unlink Device"<br>
There are two client-side methods to associate:<br>
* <code>mainClient.generateRegCode('deviceID') </code>
* <code>mainClient.unLinkDevice('deviceID')</code>


<b>Using # 5 -- Admin Functions</b><br>
* To see all active Records, go to <code>http://localhost:8081/records</code>
* To see all active regCodes, go to <codE>http://localhost:8081/regcodes</code>

<h3>Screenshots:</h3><br><br>
Show a registration code to the user on the device.<br>
<img src='screenshots/regCode.png'></img><br><br>

Form on provider website where logged in user enters the registration code.
<br> It's also possible to provide device unlinking funcitonality at this level.<br>
<img src='screenshots/form.png'></img><br><br>

Device is authorized.<br>
<img src='screenshots/success.png'></img>
