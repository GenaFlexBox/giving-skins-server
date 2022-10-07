import mongoose from "mongoose";

const SteamUser = new mongoose.Schema({
  steamID: {
    type: String,
    requierd: true,
    unique: true,
  },

  identifier: {
    type: String,
    unique: true,
  },

  profilestate: {
    type: Number,
  },

  displayName: {
    type: String,
    requierd: true,
  },

  photos: {
    type: [],
    requierd: true,
  },

  profileurl: {
    type: String,
  },

  chips: {
    type: Number,
    default: 1000, 
  },

  inventarySite: {
    type: [],
    default: [], 
  },
})

export default mongoose.model('UserSteam', SteamUser)