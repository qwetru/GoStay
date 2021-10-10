const express = require('express');
const router = express.Router();
const user = require('../models/user');
const ctrlUser = require('../controllers/users');
const flash = require('connect-flash');
const catchAsync = require('../utilities/catchAsync')
const passport = require('passport');

router.get('/register', ctrlUser.regForm)

router.post('/register', catchAsync(ctrlUser.regUser));

router.get('/login', ctrlUser.loginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), ctrlUser.loginUser)

router.get('/logout', ctrlUser.logoutUser)

module.exports = router;