const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const criminalSchema = new mongoose.Schema({
    name: {
        type: String
    },
    gender: {
        type: String
    },
    crimeType: {
        type: String
    },
    region: {
        type: String 
    },
    danger:{
        type:String
    },
    age:{
        type:String
    }
});

criminalSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("criminal", criminalSchema);