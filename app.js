
//Importering
require("dotenv").config();
const express = require("express");
const path = require("path");
const dbRouter = require("./routes/dB");
const spotifyRouter = require("./routes/spotify")
const bodyparser = require("body-parser");
const lyricsRouter = require("./routes/lyrics")
const mongoose = require("mongoose");
    
// Instansera express
const app = express();

//Ansluta till DB
mongoose.connect("mongodb+srv://admin:admin@dt162g.pjhtd.mongodb.net/Band-cal?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


//Middleware
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Origin ,Origin, Accept, X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS");
    if (req.method === 'OPTIONS') {
        res.status(200);
    } 
    next();
});

// Använd bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

    
// Skapa statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

// Använd router
app.use("/api/db", dbRouter);
app.use("/api/spotify", spotifyRouter);
app.use("/api/lyrics", lyricsRouter);
    
// Port för anslutning
const port = process.env.PORT || 3000;
    
// Starta servern
app.listen(port, () => {
    console.log("Server running on port " + port);
});

app.get("/api/band", function (req, res) {
    Band.find(function (err, Band) {

        if (err) {
            res.send(err);
        }

        res.json(Band);
    });
})

app.post("/api/band/add/", function (req, res) {

    let input = "Annaz"

    Band.aggregate([
        { $match: { name: input } }

    ]).exec((err, result) => {
        if (err) {
            console.log("error", err)
        }
        if (result == undefined || result.length ==0) {
            let band = new Band();
            band.name = input;
            band.genre = "Cover";

            Band.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("Tillagd")
                }
            }
            );
        }
        else{
            console.log(result);
            res.send("Bandet finns redan")
        }
    });
})