const { model, Schema } = require('mongoose');

const authSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email uniqueness
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['writer', 'advertiser', 'admin'] // Added 'admin' role
    },
    image: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: function () { return this.role === 'writer'; } // Required only for writers
    },
    company: {
        type: String,
        required: function () { return this.role === 'advertiser'; } // Required only for advertisers
    }
}, { timestamps: true });

module.exports = model('authors', authSchema); // Consider changing the collection name to 'users'