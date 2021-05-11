const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { log } = require("debug");

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
                expiresIn: "1h",
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
                expiresIn: "1h",
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
