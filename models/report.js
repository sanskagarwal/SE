const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const addressSchema = new mongoose.Schema({
    state: String,
    district: String,
    policeStation: String,
    city: String,
    landmark: String,
    streetName: String

});

const victimDetailsSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    fatherName: {
        type: String
    },
    gender: {
        type: String
    },
    email: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    age: {
        type: Number
    },
    idType: {
        type: String
    },
    idNumber: {
        type: Number
    },
    address: [addressSchema]

});

const incidentDetailsSchema = new mongoose.Schema({
    nature: String,
    state: String,
    district: String,
    policeStation: String,
    inicidentPlace: String,
    pincode: Number,
    incidentAdrress: String,
    incidentDescription: String
});

const evidenceDetailsSchema = new mongoose.Schema({
    description: String,
    details: String
});

const reportSchema = new mongoose.Schema({
    victimDetails: victimDetailsSchema,
    incidentDetails: incidentDetailsSchema,
    evidenceDetails: evidenceDetailsSchema,
    urgency: String,
    status:String,
    appointedPersonnel: String
})

reportSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("report", reportSchema);


