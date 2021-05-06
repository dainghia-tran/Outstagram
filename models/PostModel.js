const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    userId:String,
    caption: String,
    comments: [{username, comment}],
    creatAt: Number,
    photoSrcs: []
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;