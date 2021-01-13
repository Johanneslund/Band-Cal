const express = require("express");
const router = express.Router();

//Scheman
const Band = require("../models/band.js");
const Rehersal = require("../models/rehersal.js");
const Setlist = require("../models/setlist.js");
const Song = require("../models/song.js");

module.exports = router;


//Hämtar alla band och lägger till alla dess rep och låtlistor
router.get("/band", function (req, res) {

    Band.aggregate([
        {
            "$lookup": {
                "from": "setlists",
                "localField": "name",
                "foreignField": "band",
                "as": "setlists"
            }
        },
        {
            "$lookup": {
                "from": "rehersals",
                "localField": "name",
                "foreignField": "band",
                "as": "rehersals"
            }
        }
    ]).exec((err, result) => {
        if (err) {
            console.log("error", err)
        }
        if (result) {
            res.json(result);
        }
    });
})


//Hämtar ett specifikt band och lägger till dess reptillfällen och spellistor
router.get("/band/:bandname", function (req, res) {
    let bandname = req.params.bandname;

    Band.aggregate([
        { $match: { name: bandname } },
        {
            "$lookup": {
                "from": "setlists",
                "localField": "name",
                "foreignField": "band",
                "as": "setlists"
            }
        },
        {
            "$lookup": {
                "from": "rehersals",
                "localField": "name",
                "foreignField": "band",
                "as": "rehersals"
            }
        },
    ]).exec((err, result) => {
        if (err) {
            console.log("error", err)
        }
        if (result) {
            res.json(result);
        }
    });
})


//Hämtar en specifik spellista samt alla låtar som ligger i den
router.get("/setlist/:name", function (req, res) {
    let name = req.params.name;

    Setlist.aggregate([
        { $match: { name: name } },
        {
            "$lookup": {
                "from": "songs",
                "localField": "name",
                "foreignField": "setlist",
                "as": "songs"
            }
        }
    ]).exec((err, result) => {
        if (err) {
            console.log("error", err)
        }
        if (result) {
            res.json(result);
        }
    });
})


//Hämtar ett specifikt rep samt den spellista som skall användas
router.get("/rehersal/:name", function (req, res) {
    let name = req.params.name;

    Rehersal.aggregate([
        { $match: { name: name } },
        {
            "$lookup": {
                "from": "setlists",
                "localField": "setlist",
                "foreignField": "name",
                "as": "setlists"
            }
        }
    ]).exec((err, result) => {
        if (err) {

            console.log("error", err)
        }
        if (result) {
            console.log(result);

            res.json(result);
        }
    });

})

//Hämtar en specifik låt 
router.get("/song/:name", function (req, res) {
    let name = req.params.name;
    try {
        Song.findOne({ name: name }, (err, song) => {
            if (err) {
                return res.send("Error: " + err);
            } else if (!song) {
                return res.status(404).send("Error, song not found")
            }
            console.log(song);
            res.send(song);
        })
    } catch (error) {
        res.status(500).send("Error: " + error);
    }

})


//Hämtar alla reptillfällen och aggregerar des spellista
router.get("/rehersal", function (req, res) {

    Rehersal.aggregate([
        {
            "$lookup": {
                "from": "setlists",
                "localField": "setlist",
                "foreignField": "name",
                "as": "setlists"
            }
        }
    ]).exec((err, result) => {
        if (err) {
            console.log("error", err)
        }
        if (result) {
            res.json(result);
        }
    });
})


//Lägger till en ny låt
router.post("/song/add", function (req, res) {

    let oldSong = req.body;

    let song = new Song();

    song.name = oldSong.name;
    song.artist = oldSong.artist;
    song.finished = oldSong.finished;
    song.highlight = oldSong.highlight;
    song.setlist = oldSong.setlist;
    song.lyrics = oldSong.lyrics;

    song.save(function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Tillagd")
        }
    }
    );
})

//Lägger till ett nytt reptilfälle
router.post("/rehersal/add", function (req, res) {

    let oldRehersal = req.body;

    console.log(oldRehersal);


    let rehersal = new Rehersal();

    rehersal.name = oldRehersal.name;
    rehersal.starttime = oldRehersal.starttime;
    rehersal.endtime = oldRehersal.endtime;
    rehersal.location = oldRehersal.location;
    rehersal.band = oldRehersal.band;
    rehersal.setlist = oldRehersal.setlist;

    rehersal.save(function (err) {
        if (err) {
            console.log(err)
            res.send(err);
        }
        else {
            console.log("Success")
            res.send("Tillagd")
        }
    }
    );

})

//Tar bort en specifik låt
router.delete("/song/:name", function (req, res) {
    let name = req.params.name;

    Song.deleteOne({
        name: name
    }, function (err, song) {

        if (err) {
            res.send(err)
        }
        res.send("Braaaaa");
    })

})


//Lägger till en ny spellista
router.post("/setlist/add", function (req, res) {

    let name = req.body.name;
    let genre = req.body.genre;
    let bandName = req.body.band;

    console.log(name, genre, bandName);

    Setlist.aggregate([
        { $match: { name: name } }

    ]).exec((err, result) => {
        if (err) {
            console.log("error", err)
        }
        if (result == undefined || result.length == 0) {
            let dateTime = new Date()
            let setlist = new Setlist();

            setlist.name = name;
            setlist.genre = genre;
            setlist.createdAt = dateTime;
            setlist.band = bandName;

            setlist.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("Tillagd")
                }
            }
            );
        }
        else {
            console.log(result);
            res.send("Listan finns redan")
        }
    });
})

//Skapar ett nytt band (används inte)
router.post("/band/add", function (req, res) {

    let bandName = req.body.name;
    let genre = req.body.genre;

    console.log(bandName, genre);

    Band.aggregate([
        { $match: { name: bandName } }

    ]).exec((err, result) => {
        if (err) {
            console.log("error", err)
        }
        if (result == undefined || result.length == 0) {
            let band = new Band();
            band.name = bandName;
            band.genre = genre;

            band.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("Tillagd")
                }
            }
            );
        }
        else {
            console.log(result);
            res.send("Bandet finns redan")
        }
    });
})



//Uppdaterar en specifik låts finished eller highlight, beroende på vilket val som gjorts tidigare.
router.put("/song/:name", function (req, res) {
    let name = req.params.name;
    let finished = req.body.finished;
    let highlight = req.body.highlight;

    if (finished == null) {
        Song.findOneAndUpdate({ name: name }, { $set: { highlight: highlight } }, (err, doc) => {
            if (err) {
                res.send(err)
            }
            res.send("Braaaaa");
        });
    }
    else {
        Song.findOneAndUpdate({ name: name }, { $set: { finished: finished , highlight: false} }, (err, doc) => {
            if (err) {
                res.send(err)
            }
            res.send("Braaaaa");
        });
    }


})