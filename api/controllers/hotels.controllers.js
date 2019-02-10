//var dbconn = require("../data/dbconnection.js");
//var hotelData = require("../data/hotel-data.json");
var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');           // getting our model, queries are done through model
var ObjectId = require("mongodb").ObjectId;


var runGeoQuery = function (req, res) {

  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  // A geoJson point
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  var geoOptions = {
    spherical: true,
    maxDistance: 2000,
    num: 5
  };

  Hotel
    .geoNear(point, geoOptions, function (err, results, stats) {
      console.log("Geo results", results);
      console.log("Geo stats", stats);
      res
        .status(200)
        .json(results);
    });
};


// get all hotels
module.exports.hotelsGetAll = function (req, res) {
  // getting database object returned by the method so we can query our database
  // var db = dbconn.get();
  // var collection = db.collection("hotels"); // specify which collection we are going to work with

  var offset = 0;
  var count = 5;
  var maxCount = 10;

  // if (req.query && req.query.lat && req.query.lng) {
  //   runGeoQuery(req, res);
  //   return;
  // }

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }
  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({ message: "Query String params must be numbers" });
    return;
  }
  if (count > maxCount) {
    res
      .status(400)
      .json({ message: "Count limit of " + maxCount + " exceeded" });
    return;
  }
  // mongoose query
  Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function (err, result) {          // result is returned data
      if (err) {
        res
          .status(500)
          .json({ err });
      } else {
        console.log("Found hotels", result.length)
        res
          .status(200)
          .json(result);
      }
    });

  // collection
  //   .find()
  //   .skip(offset)
  //   .limit(count)
  //   .toArray(function (err, docs) {
  //     console.log("Found Hotels", docs);
  //     res.status(200).json(docs);
  //   });
};

module.exports.hotelsGetOne = function (req, res) {
  // var db = dbconn.get();
  // var collection = db.collection("hotels");

  var hotelId = req.params.hotelId;
  Hotel
    .findById(hotelId)
    .exec(function (err, result) {
      if (err) {
        res
          .status(500)
          .json(err);
      } else if (!result) {
        res
          .status(404)
          .json({ message: "Document not found" });
      } else {
        console.log("Found hotel with ID " + hotelId)
        res
          .status(200)
          .json(result);
      }
    });

  // collection.findOne({ _id: ObjectId(hotelId) }, function (err, doc) {
  //   res.status(200).json(doc);
  // });
};


var _splitArray = function (input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");

  } else {
    output = [];
  }
  return output;
};


module.exports.hotelsAddOne = function (req, res) {

  // document is created by mongoose so it inserts _id (ObjectId) by default
  Hotel
    .create({
      name: req.body.name,
      description: req.body.description,
      stars: parseInt(req.body.stars, 10),
      services: _splitArray(req.body.services),
      photos: _splitArray(req.body.photos),
      currency: req.body.currency,
      location: {
        address: req.body.address,
        coordinates: [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
        ]
      }
    }, function (err, hotel) {
      if (err) {
        res
          .status(400)
          .json(err);
      } else {
        console.log("Hotel Created");
        res
          .status(201)
          .json(hotel);
      }
    });




  // // var db = dbconn.get();
  // // var collection = db.collection("hotels");

  // var newHotel = req.body;

  // if (req.body && req.body.name && req.body.stars) {
  //   console.log("Post the hotel");
  //   console.log(req.body);
  //   newHotel.stars = parseInt(req.body.stars, 10);

  //   collection.insertOne(newHotel, function (err, response) {
  //     console.log(response);
  //     res.status(201).json(response.ops); // our relevant stuff is in ops object in the whole response
  //   });
  // } else {
  //   console.log("Name and stars are required");
  //   res.status(400).json({ message: "Required data missing from body" });
  // }
};

// run get query on a document to get that document and then update it, even if we update a single field in the document the whole document is sent back to the database, to update just name (called partial update we should use patch)

module.exports.hotelsUpdateOne = function (req, res) {

  var hotelId = req.params.hotelId;
  Hotel
    .findById(hotelId)
    .select("-reviews -rooms")    // minus symbol means we exclude reviews and rooms from result
    .exec(function (err, result) {
      if (err) {
        res
          .status(500)
          .json(err);
      } else if (!result) {
        res
          .status(404)
          .json({ message: "Document not found" });
      } else {
        if (res.status !== 200) {
          console.log("Found hotel with ID " + hotelId)
          res
            .status(200)
            .json(result);
        } else {
          // we are updating only main document not sub document so we will exclude the sub document
          // result is the mongoose model instance of the mongodb

          result.name = req.body.name,
            result.description = req.body.description,
            result.stars = parseInt(req.body.stars, 10),
            result.services = _splitArray(req.body.services),
            result.photos = _splitArray(req.body.photos),
            result.currency = req.body.currency,
            result.location = {
              address: req.body.address,
              coordinates: [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
              ]
            };
          // save the model instance back to mongodb. result is our model instance so we need to save it, save result which is the returned document
          result.save(function (err, resultUpdated) {
            if (err) {
              res
                .status(500)
                .json(err);
            } else {
              res
                .status(204)
                .json();
            }

          });
        }
      }
    });

};
