const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const formidable = require("formidable");

exports.getPost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await PostModel.findById(postId);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: "Post not found" });
    }
};

exports.createPost = async (req, res) => {
    const form = formidable.IncomingForm();
    form.parse();
};

exports.reactPost = async (req, res) => {
    const username = req.username;
    const postId = req.params.id;

    try {
        let post = await PostModel.findById(postId);
        isReacted = post.reacts.includes(username);
        let message;

        if (isReacted) {
            //already reacted
            post.reacts = post.reacts.filter((value, index, arr) => {
                return value !== username;
            });
            message = "Un-reacted";
        } else {
            post.reacts.push(username);
            message = "Reacted";
        }

        //update post
        try {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                post
            );
            res.status(200).json({ post, message: message });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Post not found" });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await PostModel.findById(postId);
    if (userId !== post.userId)
        res.status(403).json({
            message: "You do not have permission to delete this post.",
        });
    else {
        //valid user
        try {
            await PostModel.findByIdAndDelete(postId);
            res.status(200).json({ message: "Post successfully deleted" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
};
