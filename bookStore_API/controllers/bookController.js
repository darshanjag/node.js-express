const Book = require('./../models/bookMode');
const AppError = require('./../utils/appError');
const catchAsync  = require('./../utils/catchAsync');

exports.addBook = async(req,res,next)=>{
  const book = await Book.create(req.body);
  console.log('this is req',req.body)
  res.status(201).json({
      status: 'success',
      data:{
          book
      }
  })
}
exports.getBooks = async(req,res)=>{
    const fil = {...req.query}
 
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(el=> delete fil[el]);


    const books = await  Book.find(fil);
    res.status(200).json({
        status: 'success',
        data: {
            books
        }
    })
}

exports.deleteBook = async(req,res)=>{
    
    const book = await Book.findByIdAndDelete(req.params.id)
    if(!book){
        return next(new AppError('No document found with that ID', 404));
      }
    res.status(204).json({
        status: 'success',
        data: null
    })
    // const book = Book.findByIdAndDelete(req.params)
}

exports.getBook = catchAsync(async(req,res,next)=>{
 
    const book = await Book.findById(req.params.id);
    
    if(!book){
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    })
  
});
exports.updateBook = async(req,res)=>{
    const book = await Book.findByIdAndUpdate(req.params.id,req.body,{
        new: true
    })
    if(!book){
        return next(new AppError('No document found with that ID', 404));
      }
    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    })
}