const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { config } = require('dotenv');

config({ path: './config.env' });


exports.signup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    // Create a token for the user and send it in the response body 
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {  // The token is signed with the user's id and the secret key
        expiresIn: process.env.JWT_EXPIRES_IN  // The token expires in 90 days
    });

    res.status(201).json({
        status: 'success',
        token,  
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res) => {
     
});