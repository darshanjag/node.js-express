const mongoose = require('mongoose');
const crypto = require('crypto')
const Schema = mongoose.Schema();
const validator = require('validator'); 
const bcrypt = require('bcryptjs');

const userSchema =  mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name'],
        trim: true
    },
    email:{ 
        type: String,
        required: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail,'please enter valid email']
    },
    photo:{
        type: String,
         
    },
    role: {
        type: String,
        enum: ['user','admin','guide','lead-guide'] ,
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please type in the password'],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, 'please type in confirm password'],
        validate: {
            validator: function(el){
                return el === this.password;
            },
        message: 'passwords do not match'
        }
    },
    passwordChangedAt:Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }

});
userSchema.pre('save', async function(next){
    if(!this.isModified('password'))  return next(); 

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt= Date.now()-1000;
    next();

})
userSchema.pre(/^find/, function(next){
    this.find({active: true});
    next();
})
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() /1000,10);
    
    if(this.passwordChangedAt){
    
        console.log(changedTimeStamp, JWTTimestamp);
        return JWTTimestamp < changedTimeStamp;
    }
}
    return false;
} 
userSchema.methods.createPasswordResetToken =function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('reset token:', resetToken , this.passwordResetToken);
   
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;

}

const User = mongoose.model('User',userSchema);
module.exports = User;