const titleText = document.getElementById("title");
const artistText = document.getElementById("artist");
const lyricsText = document.getElementById("lyrics");
const titleInput = document.getElementById("title-input");
const artistInput = document.getElementById("artist-input");
const songBtn = document.getElementById("song-button");
const lyricBtn = document.getElementById("lyrics-button");


async function getSong() {

    let input = document.getElementById("title-input").value;


    const response = await fetch("/api/spotify/track=" + input);
    const tracks = await response.json();
    console.log(tracks);
    
    let title = tracks.tracks.items[0].name;
    let artist = tracks.tracks.items[0].artists[0].name
    console.log(title);
    console.log(artist)

    titleText.innerHTML = title;
    artistText.innerHTML = artist;

    return tracks;
}

async function setLyrics() {

    let title = titleText.innerHTML;
    let artist = artistText.innerHTML;

    const response = await fetch("/api/lyrics/artist=:" + artist + "&track=:" + title);
    const lyrics = await response.json();



    lyricsText.innerHTML = null;

    for (let i = 0; i < lyrics.lyrics.length; i++) {
        const element = lyrics.lyrics[i];

        if (element == "\n") {
            let span = document.createElement("br");
            lyricsText.appendChild(span);
        }
        else{
        let span = document.createElement("span");
        span.textContent = element;
        lyricsText.appendChild(span);
        }

    }

    return lyrics;

}


songBtn.addEventListener('click', function () {
    getSong()
        .then(data => console.log(data));
});

lyricBtn.addEventListener('click', function () {
    setLyrics()
    .then(data => console.log(data));
});