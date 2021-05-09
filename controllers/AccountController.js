const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    const { fullName, email, password, username } = req.body;
    try {
        const existingUsername = await UserModel.findOne({
            username: username,
        });
        if (existingUsername)
            return res.status(406).json({ message: "Username already exists" });
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser)
            return res.status(406).json({ message: "Email already exists" });

        const hashedPassword = bcryptjs.hash(password, 12);
        const currentTime = new Date();
        const result = await UserModel.create({
            email,
            password: (await hashedPassword).toString(),
            fullName,
            username,
            createAt: currentTime.getTime(),
        });

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(
            { email: result.email, id: result._id },
            secretKey,
            { expiresIn: "1h" }
        );

        res.status(200).json({ result, token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong" });
    }
};

exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (!existingUser)
            return res.status(404).json({ message: "User not found" });
        
        const validPassword = await bcryptjs.compare(password, existingUser.password);
        if (!validPassword)
            return res.status(406).json({ message: "Invalid credentials!" });
        
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            secretKey,
            { expiresIn: "1h" }
        );
        res.status(200).json({ existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
