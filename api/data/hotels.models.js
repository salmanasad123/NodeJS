var mongoose = require('mongoose');

// reviews are sub documents(they are array of objects), they are nested/embedded inside our main hotels document 
// so we need to create a seperate schema for reviews as they are seperate entity

var reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var roomSchema = new mongoose.Schema({
    type: String,
    number: Number,
    description: String,
    photos: [String],
    price: Number
});


var hotelSchema = new mongoose.Schema({
    name: {
        type: String,       // path : schema type
        required: true
    },
    stars: {
        type: Number,
        min: 0,             // validations in schema, minimum value should be 0 
        max: 5,
        "default": 0          // if no value is set for stars it will be 0
    },
    services: [String],
    description: String,
    photos: [String],
    currency: String,
    reviews: [reviewSchema],  // reviews are created as seperate schema( with this the review will                              be given a unique id(Object Id) value as they are seperate schema)
    rooms: [roomSchema],
    location: {
        address: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
        // coordinates should always be stored in correct order ,the first                               number should be longitude and second latitude
    }

});



mongoose.model("Hotel", hotelSchema);    // converting schema to model


