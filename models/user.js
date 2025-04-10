const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
   content: {
    type: String,
    required: true,
   },
   author: {
    type: String,
    default: 'Anonymous'
   } 
});


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'please fill a valid email address'],
    },
    password: {
        type: String,
        required: true
    },
    savedQuotes: [quoteSchema]
});



const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
