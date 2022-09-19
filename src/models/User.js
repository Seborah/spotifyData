//mongoose model for aa user
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
    spotifyId: String,
    accessToken: String,
    refreshToken: String,
    expires_in: Number,
    profile: Object,
})

module.exports = mongoose.model("User", UserSchema)