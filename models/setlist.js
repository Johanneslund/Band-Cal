var mongoose = require("mongoose");
const { Int32 } = require("mongodb");
var Schema = mongoose.Schema;

var setlistSchema = new Schema({
    name: String,
    genre: String,
    createdAt: Date,
    band: String
});

module.exports = mongoose.model("Setlist", setlistSchema);