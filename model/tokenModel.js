import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TokenUser = new mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    refreshToken: {
      type: String,
      requierd: true,
    },

}, {timestamps: true,})

export default mongoose.model('Token', TokenUser)