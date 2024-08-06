const mongoose = require("mongoose")

const User_schema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    mobile: {
        type: String,


    },
    password: {
        type: String,
        required: true

    },
    isAdmin: {
        type: Number,
        default: 0,

    },
    image: {
        type: String

    },


    is_blocked: {
        type: Number,
        default: 1,
    },
    address: {
        type: String
    },
    location: {
        type: String
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    address2: {
        type: Object,



    }
})
module.exports = mongoose.model("User", User_schema)