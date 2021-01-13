const express = require("express");
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
const credentials = require("../data/credentials.json");

//Använder inte denna alls så kommer inte att gå igenom den i min presentation

//Skapar en ny api
const spotifyApi = new SpotifyWebApi({
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret
});

// Client Credential och autentisering vid behov. Får acces token
const authenticate = async() => {
    await spotifyApi.clientCredentialsGrant()
    .then((data) => {
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log("Authenticated");
    }),
    (err) => {
        console.log("Sumtin done goofed... error: " + err);
    }
}

// Sök artist och spår från artist
router.get("/artist=:artist&track=:track", async (req, res) => {
    if(!spotifyApi.getAccessToken()){
        await authenticate();
    }
    let output;
    spotifyApi.searchTracks(`track:${req.params.track} artist:${req.params.artist}`)
    .then((data) => {
        output = data.body;
        console.log(data.body);
        res.send(output);
    }, (err) => {
        console.log('Something went wrong!', err);
    });
    
});

// Sök spår med titel
router.get("/track=:track", async (req, res) => {
    if(!spotifyApi.getAccessToken()){
        await authenticate();
    }
    try { 
        const track = req.params.track;
        spotifyApi.searchTracks(track)
        .then((data) => {
            console.log(data.body);
            res.send(data.body);
        }, (err) => {
            console.log('Something went wrong!', err);
        });
    } catch (error) {
        console.log(error);
    }
});

// Sök artist
router.get("/artist=:artist", async (req, res) => {
    if(!spotifyApi.getAccessToken()){
        await authenticate();
    }
    try {
        spotifyApi.searchTracks(req.params.artist)
        .then((data) => {
            console.log(data.body);
            res.send(data.body);
        }, (err) => {
            console.log('Something went wrong!', err);
        });     
    } catch (error) {
        console.log(error);
    }
    
});

//Hämtar alla spellistor från en specifik user
router.get("/userPlaylist=:user", async (req, res) => {
    if(!spotifyApi.getAccessToken()){
        await authenticate();
    }
    try {
        spotifyApi.getUserPlaylists(req.params.user)
        .then((data) => {
            console.log(data.body);
            res.send(data.body);
        }, (err) => {
            console.log('Something went wrong!', err);
        });     
    } catch (error) {
        console.log(error);
    }
    
});

module.exports = router;