const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        let decodedData;
        const secretKey = process.env.SECRET_KEY;
        if (token) {
            decodedData = jwt.verify(token, secretKey);

            req.userId = decodedData?.id;
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (error) {
        console.log(error);
    }
};