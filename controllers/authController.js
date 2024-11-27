const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {  // The token is signed with the user's id and the secret key
        expiresIn: process.env.JWT_EXPIRES_IN  // The token expires in 90 days
    });
}


exports.signup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });

    // Create a token for the user and send it in the response body 
    const token = signToken(newUser._id); 

    res.status(201).json({
        status: 'success',
        token,  
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async(req, res, next) => {
     const { email, password } = req.body;

     // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
     // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }


     // 3) If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token, 
    })

});

// Middleware to protect routes from unauthorized access

exports.protect = catchAsync(async (req, res, next) => {

    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];  // The token is in the second position of the array
    }
    console.log(token);
    
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    // 2) Verification token
    const decoded =await promisify(jwt.verify)(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new AppError('Invalid token. Please log in again!', 401));
        }
        console.log(decoded);
    });
    
    // 3) Check if user still exists
   const currentUser = await User.findById(decoded.id);
   if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
   }
   
    // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        };
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // 3) Send it to user's email
    const resetURL = `${req.protocol}: //${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
    });
    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => { 
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await UserfindOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
});