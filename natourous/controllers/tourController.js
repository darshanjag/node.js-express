const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
exports.aliasTopTours = (req,res,next)=>{
    req.query.limit ='5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name, price, summary, difficulty,ratingsAverage';
    next();

}

exports.getAllTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, {path: 'reviews'}); 


exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

  
exports.deleteTour = factory.deleteOne(Tour); 
// exports.deleteTour = catchAsync( async (req,res)=>{
    
//     await Tour.findByIdAndDelete(req.params.id);
//      res.status(200).json({
//         status: 'success',
//         data:null
//     })
  

// });

exports.getTourStats = catchAsync( async (req,res)=>{
    
        const stats = await Tour.aggregate([
            {
            $match: {ratingsAverage : {$gte: 4.5}}
            },
            {
            $group : {
            _id: '$difficulty',
            num: {$sum: 1},
            numRatings: {$sum: '$ratingsQuantity'},
            avgRating: {$avg: '$ratingsAverage'},
            averagePrice: {$avg: '$price'},
            minPrice: {$min: '$price'},
            maxPrice: {$max: '$price'},

            }
            }
        ]);
        res.status(200).json({
            status: 'success',
            data:{
                stats
            }
        })


});

exports.getMouthlyPlan =  catchAsync(async (req,res)=>{

        const year = req.params.year *1; //2021


        const plan = await Tour.aggregate([
            {   
                $unwind : '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum:1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: { mounth: '$_id'}
            },
            {
                $project :{
                    _id: 0
                }
            },
            {
                $sort: {numTourStarts: -1}
            },
            {
                $limit: 12
            }
            
        ]);
        res.status(200).json({
            status: 'success',
            data:{
                plan
            }
        })

  
});
exports.getToursWithin = catchAsync( async(req,res,next)=>{
    const{distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if(!lat || !lng){
        next(new AppError('please provide latitude and longitude in the format lat,lng', 400));
    }

    const tours = await Tour.find({
        startLocation: 
        {$geoWithin: 
            {$centerSphere:[[lng,lat], radius]}
        }
    }
    );

    console.log(distance, lat, lng, unit)
    res.status(200).json({
        results: tours.length,
        status: 'success',
        data:{
            data: tours
        }
    })
});

exports.getDistances = catchAsync( async(req,res,next)=>{
    const{ latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');

    
    if(!lat || !lng){
        next(new AppError('please provide latitude and longitude in the format lat,lng', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Poing',
                    coordinates: [lng *1, lat *1]
                },
                distanceField: 'distance'
            }
        }
    ])

    res.status(200).json({
    
        status: 'success',
        data:{
            data: distances
        }
    })
});