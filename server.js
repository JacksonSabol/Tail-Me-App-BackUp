// Dependencies
var express = require("express");

// Sets up the Express App
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var PORT = process.env.PORT || 8080;


// Requiring our models for syncing
var db = require("./models");


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// For Passport authentication through Express-Session
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
// Initialize Passport to use on the app
app.use(passport.initialize());
// Persistent login sessions
app.use(passport.session());
// Load passport strategies
require("./config/passport/passport.js")(passport, db.Auth);
// Import static directories
app.use(express.static("public"));

// Import routes
require("./routes/html-routes.js")(app);
require("./routes/auth-routes.js")(app, passport);
// require("./routes/task-api-routes.js")(app);
// require("./routes/user-api-routes.js")(app);

// React stuff here

// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({ force: true }).then(function () { // Set to false after Auth table is initially made post deployment
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});