const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apifeatures');


// Middleware
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

// Get all tours
exports.getAllTours = async (req, res) => {
   try {

    // Execute query
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort().
        limitFields().
        paginate();

    const tours = await features.query;
    

    // Send response
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
   } catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err
    });
   }
}

// Get one tour
exports.getTour = async (req, res) => {
    try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
} catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err
    });
}
};

// Create tour
exports.createTour = async (req, res) => {
    try {
    // console.log(req.body);

    // const newTour = new Tour({});
    // newTour.save()
    
    const newTour = await Tour.create(req.body);  //  We call the create method right on the model
    
    res.status(201).json({
        status: 'success',
         data: {
             tour: newTour
         }
    });
    } catch (err) {
    res.status(400).json({
        status: 'fail',
        message: err // Dont do this in production
    });
    }
};

// Update tour
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate (req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            res.status(200).json({
                status: 'success',
                data: {
                    tour
                }
            })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
 
   
}

// Delete tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
        status: 'success',
        data: null 
    });
} catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err
    });
}
}

// Get tour stats
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ]);
    
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

// Get monthly plan
exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // 2021

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates' //
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
                    _id: { $month: '$startDates' }, // group by month
                    numTourStarts: { $sum: 1 }, // sum 1 for each tour
                    tours: { $push: '$name' } // push the name of the tours in an array
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                _id: 0  // this is binary 0 to hide the id 1 to show the id
            }
        },
        {
            $sort: { numTourStarts: -1 }  // -1 for descending 1 for ascending
        },
        {
            $limit: 12  // limit to 12 results
        }
    ]);
        
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
