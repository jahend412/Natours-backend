const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing name or price'
      });
    }
    next();
  };

// Get all tours
exports.getAllTours =  (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours
        //}
    });
}

// Get one tour
exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    
    // const tour = tours.find(el => el.id === id);

    // // if (id > tours.length) {
    // if (!tour) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid ID'
    //     });
    // }

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
}

// Create tour
exports.createTour = (req, res) => {
    // console.log(req.body);
    
    res.status(201).json({
        status: 'success',
        // data: {
        //     tour: newTour
        // }
    });
}

// Update tour
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

// Delete tour
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null 
    });
}

