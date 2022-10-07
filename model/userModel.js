import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: {
      type: String,
      requierd: true,
    },

    email: {
      type: String,
      requierd: true,
      unique: true,
    },

    password: {
      type: String,
      requierd: true,
    },

    chips: {
      type: Number,
      default: 1000, 
    },

    image: {
      type: String,
      default: './img/user.png', 
    },

    isActivated: {
      type: Boolean,
      default: false
    },

    activationLink: {
      type: String,
    }
}, {timestamps: true,})

export default mongoose.model('User', User)