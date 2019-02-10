var mongoose = require('mongoose');

var dburl = "mongodb://localhost:27017/meanhotel"; // connection string

// connect to the database using mongoose

mongoose.connect(dburl);

mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected to " + dburl);
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose disconnected");
});

mongoose.connection.on('error', function (err) {
    console.log("Mongoose connection error " + err);
});

// Bring in schema and models
require('./hotels.models.js');