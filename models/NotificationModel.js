const mongoose = require("mongoose");

const { Schema } = mongoose;

const NotificationSchema = new Schema({
    userId: Schema.Types.ObjectId,
    senderUsername: String,
    createAt: { type: Number, default: Date.now },
    type: Number,
    content: { type: String, default: '' },
    target: {type: Schema.Types.ObjectId, default: ''}
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;