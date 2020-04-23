const app = require('./app');
const mongoose = require('mongoose');
const dotenv=require('dotenv'); 
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser : true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() =>{
   
    console.log('db connection successfull');
})



const port = process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`server running at ${port}`);
});
