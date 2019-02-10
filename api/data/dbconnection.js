// database connection using native driver

var MongoClient = require("mongodb").MongoClient;

var dburl = "mongodb://localhost:27017/meanhotel"; // connection string or database URL
var _connection = null;

var open = function () {
  MongoClient.connect(
    dburl,
    function (err, db) {
      if (err) {
        console.log("Database connection failed");
        return;
      }
      _connection = db.db("meanhotel"); //mongoClient.connect returns not db but client
      console.log("Database connection sccessful", db);
    }
  );
};

var get = function () {
  return _connection;
};

module.exports = {
  open: open,
  get: get
};
