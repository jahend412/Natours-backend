const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .post('/signup', authController.signup)
    .post('/login', authController.login)

router
    .post('/resetPassword', authController.resetPassword)
    .post('/forgotPassword/:token', authController.forgotPassword)
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;