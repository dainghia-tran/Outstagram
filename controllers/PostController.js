const PostModel = require("../models/PostModel");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getPosts = async (req, res) => {
    const followings = req.headers.followings;
    try {
        await PostModel.find((err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            }
            const result = docs.filter((doc) => {
                return followings.includes(doc.userId);
            });

            res.status(200).send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.createPost = async (req, res) => {
    const form = formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "/../uploads");
    form.multiples = true;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10MB
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json(err.message);

        const post = fields;

        let photos = [];

        if (files.photos != null) {
            let collection = [];
            //convert to an array for iterating
            if (files.photos.length > 1) collection = files.photos;
            else collection.push(files.photos);

            for (const photo of collection) {
                const uploadedPath = photo.path;
                let uploadedRes;
                try {
                    uploadedRes = await cloudinary.uploader.upload(
                        uploadedPath
                    );
                } catch (error) {
                    console.log(error);
                }

                photos.push(uploadedRes.secure_url);
                fs.unlink(uploadedPath, function (err) {
                    if (err) throw err;
                    console.log("File is deleted!");
                });
            }
        }

        post.photoSrcs = photos;
        post.userId = req.userId;

        try {
            await PostModel.create(post);
            res.status(200).json({ message: "Post successfully created" });
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    });
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
            await PostModel.findOneAndUpdate({ _id: postId }, post);
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

exports.commentPost = async (req, res) => {
    const username = req.username;
    const postId = req.params.id;
    const comment = req.headers.comment;

    try {
        const userComment = { username: username, comment: comment };
        //update post
        try {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $push: { comments: userComment } }
            );
            res.status(200).json({ message: "Commented" });
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
