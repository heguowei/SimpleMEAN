This is a sample web app using MySQL, Express and Mean
***
###Node-Login is built on top of the following libraries :

* [Node.js](http://nodejs.org/) - Application Server
* [Express.js](http://expressjs.com/) - Node.js Web Framework
* [MongoDb](http://www.mongodb.org/) - Database Storage
* [Jade](http://jade-lang.com/) - HTML Templating Engine
* [Stylus](http://learnboost.github.com/stylus/) - CSS Preprocessor
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Moment.js](http://momentjs.com/) - Lightweight Date Library
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/) - UI Component & Layout Library

***

###Installation & Setup
1. Install [Node.js](https://nodejs.org/) & [MongoDB](https://www.mongodb.org/) if you haven't already.
2. Clone this repository and install its dependencies.
		
		> git clone https://github.com/heguowei/SimpleMEAN.git SimpleMEAN
		> cd SimpleMean
		> npm install -d
		
3. (Optional) Add your gmail credentials to [/app/server/modules/email-settings.js](https://github.com/braitsch/node-login/blob/master/app/server/modules/email-settings.js) if you want to enable the password retrieval feature.
4. In a separate shell start the MongoDB daemon.

		> mongod

5. From within the node-login directory, start the server.

		> node app

---

###Start the app

The app should then be running under:

//localhost:3001

Available endpoints on the API are:

1 Build an endpoint that authenticates a user based on a login/password passed in a JSON payload and verifies against a simple data structure (Mongo, MySQL, etc.).

Login:localhost:3001/
Create a new account localhost:3001/signup

The funcations below are also suppot
* New User Account Creation
* Secure Password Reset via Email
* Ability to Update / Delete Account
* Session Tracking for Logged-In Users
* Local Cookie Storage for Returning Users

2 Build an endpoint that returns all users in the database filtered by a URL parameter (can be county, profession, etc) and groups them by another parameter (also your choice).
List all users:

localhost:3001/listusers

List all users in the database filter by URL parameter

http://localhost:3001/listusers?query={"profession":"Engineer"}

List all users in the database groups them by another parameter 

No Implement. I will do research in the future.

3 Build an endpoint that checks and returns the status of all components that it depends on (e.g. Is Mongo still up OK, etc.).
Healthcheck:

localhost:3001/ping

4 Build an endpoint that when called returns the list of files in a given directory

http://localhost:3001/files/:directory

The "files" endpoint requires a URL parameter listing which sub-folder(s) under the solution root folder to query:

http://localhost:3001/files/modules


Questions and suggestions for improvement are welcome.