Reference Rendezvous Implementation<br>
by James B. Pollack<br>
A Different Engine<br>

This pattern is used to link a device, such as a Smart TV or Roku, with a particular user account.<br>

The pattern:<br>

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




server: node.js<br>
database: mongodb<br>

node modules: <br>
//REST API, middleware, database interface, uuid generator<br>
restify<br>
connect<br>
mongoose<br>
mongoose-schema-extend<br>
node-uuid<br>


//user auth stuff, not needed yet<br>
bcrypt<br>
passport<br>
passport-local<br>
passport-local-mongoose<br>

//installing mongodb

-1. download from http://www.mongodb.org/dr/fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.4.3.tgz/download<br>
-2. extract the contents to /usr/local/mongodb<br>
-3. cd /usr/local/mongodb and run the following commands<br>

$ sudo mkdir -p /data/db<br>
$ whoami<br>
jpollack<br>
$ sudo chown jpollack /data/db<br>

-4. run the following commands to add mongo to your path<br><br>
vi ~/.profile (or ~/.bash_profile) and add the following<br>
export MONGO_PATH=/usr/local/mongodb<br>
export PATH=$PATH:$MONGO_PATH/bin

-5. open a new tab and type in mongo -version<br> 
-5.1 mongod (starts server)<br>

-6 open a new tab and type in mongo (starts client)<br> 
-6.1 type show dbs -> shows local (empty)<br>
-6.2 type use rdzv<br>
-6.3 type db.users.save({username:'username'});<br>
-6.4 type show dbs -> should now show rdvz<br>

-7. to setup auto start http://www.mkyong.com/mongodb/how-to-install-mongodb-on-mac-os-x/
