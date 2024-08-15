const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    image:{
        type: String,
    },
    currentDate: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Array,
        default: [],
    },
}, {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('Post', postSchema);


