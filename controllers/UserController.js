const UserModel = require("../models/UserModel");

exports.getUser = async (req, res) => {
    const param = req.params.param;
    try {
        const user = await UserModel.findOne({
            $or: [{ username: param }, { _id: param }],
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
