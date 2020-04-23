const express = require('express');
const router = express.Router();
const bookController = require('./../controllers/bookController');

router.route('/').post(bookController.addBook)
.get(bookController.getBooks)



router
.route('/:id')
.get(bookController.getBook)
.patch(bookController.updateBook)
.delete(bookController.deleteBook);

module.exports = router;
