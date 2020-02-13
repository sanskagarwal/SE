const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const policeSchema = new mongoose.Schema({
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

policeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("police", policeSchema);