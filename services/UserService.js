const UserModel = require("../models/UserModel");

exports.getUserById = async (uid) => {
    const result = await UserModel.findById(uid);
    console.log(result);
};

exports.getAllUsers = async () => {
    return await UserModel.find({});
}