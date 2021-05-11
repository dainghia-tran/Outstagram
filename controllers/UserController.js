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

exports.getSuggestions = async (req, res) => {
    const userId = req.userId;
    const followings = req.headers.followings;

    try {
        await UserModel.find((err, docs) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }

            const result = docs.filter(doc => {
                return (!followings.includes(doc._id) && doc._id != userId);
            });

            res.status(200).json(result.slice(0, 5));
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}
