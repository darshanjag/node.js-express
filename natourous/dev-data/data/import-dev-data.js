const fs = require('fs');

const mongoose = require('mongoose');
const dotenv=require('dotenv'); 
dotenv.config({path: './../../config.env'});
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel')
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB,{
    useNewUrlParser : true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() =>{
   
    console.log('db connection successfull');
});
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));



console.log('data successfully saved');

const importData = async () =>{
    try{
        await Tour.create(tours, {validateBeforeSave: false})
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews)

    }catch(err){
        console.log(err)

    } 

};
//delete all the data from db
const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('successfully deleted');
    }catch(err){
        console.log(err)

    } 

}
if(process.argv[2]=== '--import'){
    importData();
}else if(process.argv[2]=== '--delete'){
    deleteData();
}

console.log(process.argv);