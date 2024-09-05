const { model, Schema } = require('mongoose');

const gallery_schema = new Schema({
    writerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'authors'
    },
    url: {
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
}, { timestamps: true });

module.exports = model('media', gallery_schema);
