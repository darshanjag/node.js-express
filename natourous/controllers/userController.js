const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

 
const filterObj = (obj, ...allowedFields)=>{
    const newObj ={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}
 exports.getAllUsers = catchAsync( async(req,res, next)=>{
    const users = await User.find();
    res.status(200).json({
        
        status: 'success',
        results: users.length,
        data: ({
            users
        })
    })
});
exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead'
    });
  };

 exports.getUser = factory.getOne(User); 

 exports.updateUser = factory.updateOne(User); 

 exports.deleteUser =factory.deleteOne(User); 
exports.updateMe = catchAsync( async(req,res,next)=>{
    //create errors if post password data
    if(req.body.password|| req.body.passwordConfirm){
      return next(new AppError(
        'this is not a route for password updates. please use route /update my password',400));
    }
    const filteredBody = filterObj(req.body,'name','email');
  
    //update the user documnet
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,
      {new:true,
      runValidators:true
    });
    
    res.status(200).json({ 
      status: 'success',
      data: updatedUser
    })
  });

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status:'success',
        data: "deleted"
    })
})

exports.getMe =  (req,res,next)=>{
    req.params.id = req.user.id;
    next();
}