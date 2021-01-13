const express = require("express");
const router = express.Router();
const https = require("https");


//Hämtar och returnerar låttext om den finns.
router.get("/artist=:artist&track=:track", (req, res) => {

    let artist = req.params.artist;
    let track = req.params.track;
    let search = 'https://api.lyrics.ovh/v1/' + artist + "/" + track;

    let body = '';

    https.get(search, (resp) => {
        resp.on("data", data => {
            body += data
        })
        resp.on("end", () => res.send(body));
    });
});

module.exports = router;