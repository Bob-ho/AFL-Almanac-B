var express = require('express');
var app = express();
app.enable('trust proxy');

var expressValidator = require('express-validator');
//var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var morgan = require("morgan");

var bodyParser = require('body-parser'); // Node.js body parsing middleware. Parses incoming request bodies in a middleware before your handlers, available under req.body.
var router = express.Router(); // Invoke the Express Router
app.use(express.static(__dirname + '/public')); // Allow front end to access public folder
var path = require('path');


app.use(expressValidator());
var appRoutes = require('./app/routes/api')(router); // Import the application end points/API
cfenv = require('cfenv');// Cloud Foundry Environment Variables
appEnv = cfenv.getAppEnv();// Grab environment variables

// Use SSL connection provided by Bluemix. No setup required besides redirecting all HTTP requests to HTTPS
if (!appEnv.isLocal) {
    app.use(function (req, res, next) {
        if (req.secure) // returns true is protocol = https
            next();
        else
            res.redirect('https://' + req.headers.host + req.url);
    });
}
app.use(morgan("dev"));




app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));

app.use(appRoutes);



/********************************
Local Environment Variables
 ********************************/
if(appEnv.isLocal){
    require('dotenv').load();// Loads .env file into environment
}

/******************************** 
 MongoDB Connection
 ********************************/

//Detects environment and connects to appropriate DB
if(appEnv.isLocal){
    mongoose.connect(process.env.LOCAL_MONGODB_URL);
    sessionDB = process.env.LOCAL_MONGODB_URL;
    console.log('Your MongoDB is running at ' + process.env.LOCAL_MONGODB_URL);
}
// Connect to MongoDB Service on Bluemix
else if(!appEnv.isLocal) {
    var mongoDbUrl, mongoDbOptions = {};
    var mongoDbCredentials = appEnv.services["compose-for-mongodb"][0].credentials;
    var ca = [new Buffer(mongoDbCredentials.ca_certificate_base64, 'base64')];
    mongoDbUrl = mongoDbCredentials.uri;
    mongoDbOptions = {
      mongos: {
        ssl: true,
        sslValidate: true,
        sslCA: ca,
        poolSize: 1,
        reconnectTries: 1
      }
    };

    console.log("Your MongoDB is running at ", mongoDbUrl);
    mongoose.connect(mongoDbUrl, mongoDbOptions); // connect to our database
    sessionDB = mongoDbUrl;
}
else{
    console.log('Unable to connect to MongoDB.');
}





app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// app.listen(port, function () {
//     console.log("Running the server on port " + port);
// });
/********************************
Ports
********************************/
app.listen(appEnv.port, appEnv.bind, function () {
    console.log("Node server running on " + appEnv.url);
});