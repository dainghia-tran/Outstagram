const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
const e = require("express");

exports.signUp = async (req, res) => {
    const { fullName, email, password, username } = req.body.user;
    try {
        const existingUsername = await UserModel.findOne({
            username: username,
        });
        if (existingUsername)
            return res.status(406).json({ message: "Username already exists" });
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser)
            return res.status(406).json({ message: "Email already exists" });

        const hashedPassword = await bcryptjs.hash(password, 12);
        const currentTime = new Date();
        const user = await UserModel.create({
            email,
            password: hashedPassword.toString(),
            fullName,
            username,
            createAt: currentTime.getTime(),
        });

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(
            { email: user.email, username: user.username, id: user._id },
            secretKey,
            {
                expiresIn: "365d",
            }
        );

        res.status(200).json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong" });
    }
};

exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword)
            return res.status(406).json({ message: "Invalid credentials!" });

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(
            { email: user.email, username: user.username, id: user._id },
            secretKey,
            {
                expiresIn: "365d",
            }
        );
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.signOut = (req, res) => {
    return res.status(200).json({ message: "Signed out" });
};

exports.changePassword = async (req, res) => {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await UserModel.findById(userId);
        const isValid = await bcryptjs.compare(oldPassword, user.password);
        if (isValid) {
            const hashedPassword = await bcryptjs.hash(newPassword, 12);
            await UserModel.findByIdAndUpdate(userId, {
                password: hashedPassword,
            });
            res.status(200).json({ message: "Password changed successfully" });
        } else res.status(400).json({ message: "Old password is not correct" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
};

exports.search = async (req, res) => {
    const keyword = req.query.keyword;
    try {
        const users = await UserModel.fuzzySearch(keyword);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.changeAvatar = async (req, res) => {
    const userId = req.userId;

    const form = formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "/../uploads");
    form.multiples = true;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10MB
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json(err.message);
        let photoUrl;

        if (files.photo.type != null) {
            const uploadedPath = files.photo.path;
            let uploadedRes;
            try {
                uploadedRes = await cloudinary.uploader.upload(uploadedPath);
            } catch (error) {
                console.log(error);
            }

            photoUrl = uploadedRes.secure_url;
            fs.unlink(uploadedPath, function (err) {
                if (err) throw err;
                console.log("File is deleted!");
            });
        }

        try {
            const user = await UserModel.findByIdAndUpdate(userId, {
                avatar: photoUrl,
            });
            user.avatar = photoUrl;
            res.status(200).json({
                user,
                message: "Avatar changed successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
};

exports.follow = async (req, res) => {
    const userId = req.userId;
    const targetId = req.body.targetId;
    try {
        let user = await UserModel.findById(userId);
        let target = await UserModel.findById(targetId);

        let message;

        const isFollowed = user.followings.includes(targetId);
        if (isFollowed) {
            user.followings = user.followings.filter((follower) => {
                return follower != targetId;
            });

            target.followers = target.followers.filter((follower) => {
                return follower != userId;
            });
            console.log("targetid: " + target);
            NotificationModel.create({
                senderUsername: user.username,
                type: 0,
                userId: target._id,
                target: user._id,
            });

            message = "Unfollowed this user";
        } else {
            user.followings.push(targetId);
            target.followers.push(userId);
            message = "Followed this user";

            NotificationModel.create({
                senderUsername: user.username,
                type: 1,
                userId: target._id,
                target: user._id,
            });
        }

        await UserModel.findByIdAndUpdate(userId, user);
        await UserModel.findByIdAndUpdate(targetId, target);

        res.status(200).json({ followings: user.followings, message: message });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.save = async (req, res) => {
    const userId = req.userId;
    const targetPostId = req.body.targetPostId;
    console.log(targetPostId);

    try {
        let user = await UserModel.findById(userId);
        let message;

        const isSaved = user.saved.includes(targetPostId);
        if (isSaved) {
            user.saved = user.saved.filter((postId) => {
                return postId != targetPostId;
            });
            message = "Removed this saved post";
        } else {
            user.saved.push(targetPostId);
            message = "Saved this post";
        }

        await UserModel.findByIdAndUpdate(userId, user);

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
