// we want our roots in the seperate folder so we created seperate file for routes
var express = require("express");
var router = express.Router();
var ctrlHotels = require("../controllers/hotels.controllers.js");
var ctrlReviews = require('../controllers/reviews.controllers.js');

// moving route handlers into their controllers, seperation of concerns
router.route("/hotels").get(ctrlHotels.hotelsGetAll);

router
    .route("/hotels/:hotelId")
    .get(ctrlHotels.hotelsGetOne)
    .put(ctrlHotels.hotelsUpdateOne);

router.route("/hotels").post(ctrlHotels.hotelsAddOne);

router
    .route("/hotels/:hotelId/reviews")
    .get(ctrlReviews.reviewsGetAll)
    .post(ctrlReviews.reviewsAddOne);

router
    .route("/hotels/:hotelId/reviews/:reviewId")
    .get(ctrlReviews.reviewsGetOne)
    .put(ctrlReviews.reviewsUpdateOne);



module.exports = router;
