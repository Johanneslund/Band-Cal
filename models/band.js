var mongoose = require("mongoose");
const { Int32 } = require("mongodb");
var Schema = mongoose.Schema;

var bandSchema = new Schema({
    name: String,
    genre: String
});

module.exports = mongoose.model("Band", bandSchema);