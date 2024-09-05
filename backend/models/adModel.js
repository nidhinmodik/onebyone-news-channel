const { model, Schema } = require('mongoose');

const adSchema = new Schema({
    advertiserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'advertisers' // Assuming you have an 'advertisers' collection
    },
    mediaUrl: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        required: true,
        enum: ['image', 'video']
    },
    duration: {
        type: Number,
        required: function () { return this.mediaType === 'video'; }
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = model('advertisements', adSchema);
