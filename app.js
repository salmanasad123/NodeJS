// var db_connection = require("./api/data/dbconnection.js");
var mongoose_connection = require('./api/data/db.js');
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var routes = require("./api/routes");


// connecting to database as soon as the app starts
// db_connection.open();

app.set("port", 3000);

// log every request method and url using the middlewarwe
app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

// urlecoded means how forms are submitted, and extended to false will give us access to arrays and strings for our form body
app.use(bodyParser.urlencoded({ extended: false }));

// express will look into routes folder for any route that starts with /api
app.use("/api", routes);

// listening for requests at port 3000
var server = app.listen(app.get("port"), function () {
  var port = server.address().port;
  console.log("Listening on port " + port);
});
