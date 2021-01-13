var mongoose = require("mongoose");
const { Int32 } = require("mongodb");
var Schema = mongoose.Schema;

var rehersalSchema = new Schema({

    name: String,
    starttime: Date,
    endtime: Date,
    location: String,
    band: String,
    setlist: String,
    finished: Boolean
});

module.exports = mongoose.model("Rehersal", rehersalSchema);