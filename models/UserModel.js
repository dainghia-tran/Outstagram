const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createAt: Number,
    lastLogin: Number,
    followers: [],
    followings: [],
    description: String,
    postIds: [],
    saved: [{ postId: String }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
