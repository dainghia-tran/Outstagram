const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongooseEmail = require("passport-local-mongoose-email");
const pwd = require("pwd");

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

UserSchema.plugin(passportLocalMongooseEmail);

UserSchema.methods.validPassword = function (password) {
    return pwd.hash(password, this.salt).then((result) => {
        if (this.hash === result.hash) return true;
        return false;
    });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
