const express = require('express');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./controllers/errorController');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const appError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const path = require('path');

const app = express();


//view engine
app.set('view engine', 'pug');
app.set('views',path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname,'public')));
//set  security http headers
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs:60*60*1000,
  message: 'too many request from this ip, please try again in an hour'
});

app.use('/api', limiter);

//body parser
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

//data sanitization against nosql query injection
app.use(mongoSanitize());

//data sanitization xss 
app.use(xss());      




//prevent parameter pollution
app.use(hpp({
  whitelist: 
  ['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}));

app.use((req, res, next) => {
    
    req.requestTime = new Date().toISOString();
    next();
  });
  


//user functions 


 app.use((req,res,next)=>{
   console.log(req.cookies);
   next();
 })





    


  


    //user routes


    app.use('/', viewRouter);
    app.use('/api/v1/tours',tourRouter);
    app.use('/api/v1/users',userRouter);
    app.use('/api/v1/review',reviewRouter);

    app.use(globalErrorHandler);

module.exports = app;
 