const express = require('express');
const app = express();
const dotenv=require('dotenv'); 
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bookRoute = require('./routes/bookRoutes')
dotenv.config({path: './config.env'});
const port =  process.env.PORT|| 3000;
const url = 'mongodb://127.0.0.1:27017/bookstore';

//body parser
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.use('/api/v1/books',bookRoute);
mongoose.connect(url,{useNewUrlParser: true
    , useUnifiedTopology: true,
     useFindAndModify: false }).then(()=>{
        console.log('connected to the database')
    })


    app.use((err,req,res,next)=>{
        err.statusCode =err.statusCode || 500;
        err.status = err.status || 'error';
        res.status(err.statusCode).json({ 
            status: err.status,
            msg: err.message
        })
    
    })
app.listen(port,()=>{
    console.log(`server running on port: ${port}`);
})