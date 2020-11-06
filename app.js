require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
//from .env FILE, To avoid making our API keys public,
//we don't want to add and commit them. We'll use a package named dotenv for that
//do not have it here directly as Breach  of Security 
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
//entry point of our WEbsite
app.get('/', (req, res) => {
    //console.log(`ROUTE`)
    res.render('index')  
});

app.get('/artist-search', (req, res) => {   // we are getting a request response
    // QUERY = FORM & GET REQUEST
    //because it is a FORM we are doing a QUERY type
    //req.query.(NAME OF INPUT on hbs)

    spotifyApi.searchArtists(req.query.artistName)  
    // I could let artistName = req.query.artistName
    // and then spotifyApi.searchArtists(artistName)

    // THis is a PROMISE so returns a THEN
    //No code can be here before the .then
    .then(data => {
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

        // through console.log and teh Terminal we need to understand the content and type of info we got 
        let artists = data.body.artists.items;
        console.log('The received data from the API: ', artists);
      
        //now we display teh view! not before or outside
        //no need for passing the data is we just want to render the view 
        // need a second argument if we are displaying teh data somewhere else 
        res.render('artist-search-results', {artistsResults: artists}) 
  })
    .catch(err => console.log('The error while searching artists occurred: ', err)); 
});

app.get('/albums/:artistId', (req, res) => {
    //DYNAMIC PARAM passing it in my LINK/ROUTE as I want to call it
    //PARAMS = ROUTE LINK   hbs=> (<button><a href="/albums/{{id}}"> View Albums</a></button>)
    //that  I decide to call - /:"artistId" = variable => req.params."artistId"
    let artistId = req.params.artistId; 
    console.log(artistId)

    spotifyApi.getArtistAlbums(artistId) 
    .then(albumsOfArtists => {
        let albums = albumsOfArtists.body.items;

        //we can manipulate the info
        //albums.slice()
        //albums[0].name ="blabla"

        console.log('The received albums: ', albums);
        res.render('albums', {albumsResults: albums})   
        //because it is an ARRAY we have to turn it into an OBJECT 
        //ALbumsResults is teh key we are going to use 
  })
    .catch(err => console.log('The error while searching albums occurred: ', err)); 
});


app.get('/album/:tracks', (req, res) => {    

    let trackList = req.params.tracks; // PARAM = LINK/ROUTE
    console.log(trackList)

    spotifyApi.getAlbumTracks(trackList)
    .then(tracksOfArtists => {
        let tracks = tracksOfArtists.body.items;
        console.log('The received tracks: ', tracks);
        res.render('tracks', { tracksResults: tracks}) 
  })
    .catch(err => console.log('The error while searching albums occurred: ', err)); 
});

//PORT 
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
