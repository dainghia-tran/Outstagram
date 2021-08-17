const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const NotificationModel = require("../models/NotificationModel");

exports.getUser = async (req, res) => {
    const param = req.params.param;

    UserModel.find({ username: param })
        .lean()
        .exec(async (error, user) => {
            if (user.length === 0) {
                try {
                    user = await UserModel.findById(param);
                    console.log(user);
                    res.status(200).json(user);
                } catch (error) {
                    console.log(error);
                    res.status(404).json({ message: "User not found" });
                }
            } else {
                let postList = [];
                for (const postId of user[0].postIds) {
                    const post = await PostModel.findById(postId).lean();
                    if (post != null) postList.push(post);
                }
                user[0].postList = postList;
                delete user[0].fullName_fuzzy;
                delete user[0].username_fuzzy;
                res.status(200).json(user[0]);
            }
        });
};

exports.getSuggestions = async (req, res) => {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    const followings = user.followings;

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

module.exports.getNotifications = async (req, res) => {
    const userId = req.userId;
    try {
        const notifications = await NotificationModel.find({ userId: userId });
        res.status(200).json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
};
