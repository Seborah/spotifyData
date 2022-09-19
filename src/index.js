var SpotifyWebApi = require("spotify-web-api-node")
var auth = require("./auth.json")

var spotifyApi = new SpotifyWebApi(auth)

const SpotifyStrategy = require("passport-spotify").Strategy
var User = require("./models/User.js")
const passport = require("passport")

passport.use(
	new SpotifyStrategy(
		{
			clientID: auth.clientId,
			clientSecret: auth.clientSecret,
			callbackURL: "http://localhost:8888/auth/spotify/callback",
        },
        
		function (accessToken, refreshToken, expires_in, profile, done) {
            new User({
                spotifyId: profile.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expires_in: expires_in,
                profile: profile
            }).save()
		}
	)
)

var express = require("express")
const { authenticate } = require("passport")
var app = express()

app.use(require("cookie-parser")())
app.use(require("body-parser").urlencoded({ extended: true }))
app.use(require("express-session")({ secret: "Sakura", resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())


app.get("/auth/spotify", passport.authenticate("spotify"))

app.get("/auth/spotify/callback", passport.authenticate("spotify", { failureRedirect: "/login" }), function (req, res) {
	// Successful authentication, redirect home.
	res.redirect("/")
})

app.listen(8888)