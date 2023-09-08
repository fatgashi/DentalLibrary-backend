const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'users' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'users' },
    content: String,
    timestamp: Date,
    read: Boolean,
});

const MessageModel = mongoose.model('Messages', MessageSchema);

module.exports = MessageModel;