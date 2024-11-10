const Tour = require('../models/tourModel');


// Get all tours
exports.getAllTours = async (req, res) => {
   try {
    // Build query
    // 1) Filtering
    const queryObj = { ...req.query };  // destructuring the object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const query = await Tour.find(queryObj);

    // 2) Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }

    
    // const tours = await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy');

    // Execute query
    const tours = await query;
    
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
