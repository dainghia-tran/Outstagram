const UserModel = require("../models/UserModel");

module.exports.getUserById = async (uid) => {
    const result = await UserModel.findById(uid);
    console.log(result);
};

module.exports.getAllUsers = async () => {
    return await UserModel.find({});
}