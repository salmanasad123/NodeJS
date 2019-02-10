var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function (req, res) {

    // since nested(sub) documents are inside parent document so we need to go through the parent document first, we need to find parent document first

    var hotelId = req.params.hotelId;
    console.log("Found hotel with id " + hotelId);
    Hotel
        .findById(hotelId)
        .select('reviews')                    // only select the fields we want to return
        .exec(function (err, hotel) {
            if (err) {
                res
                    .status(500)
                    .json(err);
            } else {
                res
                    .status(200)
                    .json(hotel.reviews);     // hotel is our returned data which is one hotel and by                               using dot we know the review is inside that hotel
            }
        });


};



module.exports.reviewsGetOne = function (req, res) {

    // since our data was not created by mongoose so mongoose automatically create _id fields for sub documents and assign object Id to them, so our document was created with test data file from json so we need to add objectId to sub document i.e reviews by mongo shell

    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    console.log("Get review id " + reviewId + " for hotel " + hotelId);
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, hotel) {
            if (err) {
                res
                    .status(500)
                    .json(err);
            } else {
                var review = hotel.reviews.id(reviewId);
                res
                    .status(200)
                    .json(review);
            }
        });

};

var _addReview = function (req, res, hotel) {

    hotel.reviews.push({                 // send review object
        name: req.body.name,
        rating: parseInt(req.body.rating, 10),
        review: req.body.review
    });
    // now we have created our sub document we need to save it , since it is nested document we need to save our parent document in order to save the sub document

    hotel.save(function (err, hotelUpdated) {
        if (err) {
            res
                .status(500)
                .json(err);
        } else {
            res
                .status(201)
                .json(hotelUpdated.reviews);
        }
    });

};

module.exports.reviewsAddOne = function (req, res) {
    // sub documents are accessed by parent documents so we need to find parent document to add/ insert sub document.

    var hotelId = req.params.hotelId;
    console.log("Found hotel with id " + hotelId);
    Hotel
        .findById(hotelId)
        .select('reviews')                    // only select the fields we want to return
        .exec(function (err, hotel) {      // hotel is our returned data which is one hotel and by                                          using dot we know the review is inside that hotel
            if (err) {
                res
                    .status(500)
                    .json(err);
            } else if (!hotel) {
                res
                    .status(404)
                    .json({ message: "Hotel not found in database" });
            } else {
                if (hotel) {
                    _addReview(req, res, hotel);
                } else {
                    res
                        .status(200)
                        .json([]);
                }
            }
        });
};


module.exports.reviewsUpdateOne = function (req, res) {
    // sub documents are not saved by themselves only the parent document should be saved because sub documents are part of parent documents
};