import mongoose from "mongoose";

const WeaponModel = new mongoose.Schema({
    id: {
        type: String
    },

    hash_name: {
        type: String
    },

    name: {
        type: String
    },

    description: {
        type: String
    },

    slug: {
        type: String
    },

    type: {
        type: String,
    },

    items: {
        type: [],
        default: [],
    },
});

export default mongoose.model("Weapons", WeaponModel);
