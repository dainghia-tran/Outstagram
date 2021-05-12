const UserModel = require("../models/UserModel");

exports.getUser = async (req, res) => {
    const param = req.params.param;

    UserModel.find({ username: param }).exec(async (error, user) => {
        if (user.length === 0) {
            try {
                user = await UserModel.findById(param);
                console.log(user);
                res.status(200).json(user);
            } catch (error) {
                console.log(error);
                res.status(404).json({ message: "User not found" });
            }
        } else
            res.status(200).json(user);
    });
};

exports.getSuggestions = async (req, res) => {
    const userId = req.userId;
    const followings = req.headers.followings;

    try {
        await UserModel.find((err, docs) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }

            const result = docs.filter((doc) => {
                return !followings.includes(doc._id) && doc._id != userId;
            });

            res.status(200).json(result.slice(0, 5));
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
};
