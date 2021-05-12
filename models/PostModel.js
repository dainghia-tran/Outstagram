const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
    userId: Schema.Types.ObjectId,
    captions: String,
    comments: [{ username: String, comment: String }],
    createAt: { type:Number, default: Date.now },
    reacts: [],
    photoSrcs: [],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;