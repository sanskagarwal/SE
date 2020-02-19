const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
    from: String,
    text: String,
    admin: Boolean,
    createdAt: String
});

module.exports = mongoose.model("forums", forumSchema);