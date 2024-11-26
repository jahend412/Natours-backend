const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'], 
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false  // This hides the password 
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on SAVE!!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        }
    }
});


// Document middleware: runs before .save() and .create()
userSchema.pre('save', async function(next) {
    
    // Only run this function if the password was actually modified
    if(!this.isModified('password')) return next();
    
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);  // 12 is the cost parameter and a general value
    
    // Delete the passwordConfirm field
    this.passwordConfirm = undefined;  // We don't want to persist the passwordConfirm in the database
    next();  // We need to call next() to move on to the next middleware
});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;