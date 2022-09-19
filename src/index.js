var SpotifyWebApi = require("spotify-web-api-node")

var auth = require("./auth.json")

var spotifyApi = new SpotifyWebApi(auth.SpotifyAPI)

const SpotifyStrategy = require("passport-spotify").Strategy
const passport = require("passport")

var mongoose = require("mongoose")
mongoose.connect(
	auth.Mongoose.URI,
	{
		auth: {
			username: auth.Mongoose.username,
			password: auth.Mongoose.password,
		},
	},
	(err) => {
		if (err) console.log(err)
		else console.log("Connected to MongoDB")
	}
)

var User = require("./models/User.js")

passport.use(
	new SpotifyStrategy(
		{
			clientID: auth.SpotifyAPI.clientId,
			clientSecret: auth.SpotifyAPI.clientSecret,
			callbackURL: "http://localhost:8888/auth/spotify/callback",
		},

		(accessToken, refreshToken, expires_in, profile, done) => {
			var temp = new User({
				spotifyId: profile.id,
				accessToken: accessToken,
				refreshToken: refreshToken,
				expires_in: expires_in,
				profile: profile,
            })
            temp.save()
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
