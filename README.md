Reference Rendezvous Implementation
by James B. Pollack
A Different Engine

This pattern is used to link a device, such as a Smart TV or Roku, with a particular user account.

The pattern:

The client requests a registration code from the server by sending it a device ID.
The server generates a registration code and returns it to the client.
The client displays the code to the user.
The user enters their account information, along with the registration code, on the provider website.
The provider verifies the account and sends a message to the server with the registration code and an expiration date for the subscription.
The server associates the registration code with the device ID and authorizes the subscription.
The client polls the server until it recieves authorization and changes state*.
The database will use its expiration functions to purge both old registration codes and old subscriptions.

*[I would like to replace this step with a socket to prevent unnecessary polling, but device support is not yet robust.




server: node.js
database: mongodb

node modules: 
//REST API, middleware, database interface, uuid generator
restify
connect
mongoose
mongoose-schema-extend
node-uuid


//user auth stuff, not needed yet
bcrypt
passport
passport-local
passport-local-mongoose



