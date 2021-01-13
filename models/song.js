var mongoose = require("mongoose");
const { Int32 } = require("mongodb");
var Schema = mongoose.Schema;

var songSchema = new Schema({
    name: String,
    genre: String,
    artist: String, 
    lyrics: String,
    setlist: String,
    finished: Boolean,
    highlight: Boolean
});

module.exports = mongoose.model("Song", songSchema);