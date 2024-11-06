const Tour = require('../models/tourModel');


// Get all tours
exports.getAllTours = async (req, res) => {
   try {
    const tours = await Tour.find();
    
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
exports.getTour = (req, res) => {
    try {
    const tour = Tour.findById(req.params.id);
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
        message: 'Invalid data sent!' // Dont do this in production
    });
    }
};

// Update tour
exports.updateTour = async (req, res) => {
    try {
        const tour = Tour.findByIdAndUpdate (req.params.id, req.body, {
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
