const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const citizenSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: String 
    }
});

citizenSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("citizens", citizenSchema);