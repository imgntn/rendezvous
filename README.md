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



