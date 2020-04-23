const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
const tourSchema = new mongoose.Schema({
    name: {

        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A Tout Name Must Have Less Or Equal than 40 Characters'],
        minlength: [10, 'A Tout Name Must more Or Equal than 10 Characters']
    },
    slug: String,
    duration:{
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true,'A tour must have a difficulty'],
        enum: { values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either easy, medium difficult '
    }

    },
    secretTour:{
        type: Boolean,
        default: false 
    },

    price: {
        type: Number,
        required: true
    },
    priceDiscount: {
        type: Number,
        default: 0,
        validate:
        { validator: function(val){
            return val < this.price; // 100 < 200
        },
        message: 'discount price ({VALUE}) should be below our regular price'
    }
       
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1,'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val=> Math.round(val* 10)/ 10 
    },
    ratingsQuantity: {
        type: Number,
        default: 0
      },
    summary: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true

    }, 
    imageCover:{
        type: String,
        required:[true, 'an image must have a cover']
    },
    images:[String],

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations:[
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
    

},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},


}); 
//indexes

tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});
tourSchema.index({startLocation: '2Dsphere'});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//virtual populate
// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower: true});
    next();
})
// tourSchema.pre('save', async function(next){
//     const guidesPromises= this.guides.map(async id=>await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);

//     next();
// })

tourSchema.pre('find', function(next){
    this.find({secretTour: {$ne: true}});
    next();
})
tourSchema.pre(/^find/, function(next){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    next()

})


//AGGREGATION middlewear
// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
//     console.log(this.pipeline());
//     next();
// })
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;