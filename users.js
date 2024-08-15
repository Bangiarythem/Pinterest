const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/newapp");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    dp: {
        type: String,
        default: 'defaultDpUrl', // Replace with your default DP URL if needed
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);


