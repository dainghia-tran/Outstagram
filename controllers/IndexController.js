exports.unauthorized = (req, res) => {
    res.statusCode = 401;
    res.json({ message: "Email or password is not valid" });
}