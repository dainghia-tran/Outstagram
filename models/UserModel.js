const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: String,
    username: { type: String, required: true, unique: true },
    createAt: Number,
    lastLogin: Number,
    followers: [],
    followings: [],
    description: String,
    postIds: [],
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;
