const mongoose = require("mongoose");
const { Schema } = mongoose;

const mongooseFuzzySearching = require("mongoose-fuzzy-searching");

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    createAt: { type: Number, default: Date.now },
    lastLogin: Number,
    followers: [],
    followings: [],
    description: String,
    postIds: [],
    saved: [{ postId: String }],
});

UserSchema.plugin(mongooseFuzzySearching, { fields: ["fullName", "username"] });

const User = mongoose.model("User", UserSchema);

module.exports = User;
