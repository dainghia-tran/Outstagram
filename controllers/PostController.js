const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

exports.getPost = async (req, res) => {
    let postId = req.params.id;
    var post = await PostModel.findById(postId);
    console.log(UserModel.findOne({ _id: "6093fe62fe876c4a3023024b" }));
    if (!post) {
        res.statusCode = 404;
    } else {
        res.statusCode = 200;
        res.send(post);
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.headers._id;
    const post = await PostModel.findById(postId);
    if (post.validUser(req.headers.userid)) {
        await PostModel.findByIdAndDelete(postId);
        res.statusCode = 200;
    } else {
        res.statusCode = 401;
    }
}