const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const VisitorSchema = new Schema({
    ipAddress: String, // IP address of the visitor
    timestamp: { type: Date, default: Date.now }
})

const Visitor = mongoose.model('Visitor', VisitorSchema);

module.exports = Visitor;