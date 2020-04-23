const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publication: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    image:{
        type: String
    }
})

const Book =mongoose.model('Book',bookSchema);
module.exports = Book;
