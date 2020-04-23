const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');




exports.getOverview = catchAsync(async(req,res)=>{
 
    const tours = await Tour.find(); 

    res.status(200).render('overview',{
      title: 'All Tours',
      tours
    })
  });




exports.getTour = catchAsync( async(req,res)=>{


  // get the data, fot the requested tour (including reviews and guides)
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews'
  });


  //build template

  // render template using data from 1
    res.status(200).render('tour',{
      title: `${tour.name} Tour`,
      tour
    })
  });

exports.getLoginForm = (req,res)=>{
  res.status(200).render('login',{
    title: 'Log into your account'
  })
}