const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const ExpErr = require('../utilities/ExpErr');
const hotel = require('../models/hotel');
const ctrlHotel = require('../controllers/hotels');
const flash = require('connect-flash');
const { isLoggedIn, validateHotel, isOwner } = require('../utilities/middleware');
const { storage } = require('../cloudinary')
const multer = require('multer');
const upload = multer({ storage });


router.route('/')
    .get(isLoggedIn, catchAsync(ctrlHotel.displayIndex))
    .post(isLoggedIn, upload.array('image'), catchAsync(ctrlHotel.addHotel))


router.get('/new', isLoggedIn, ctrlHotel.newForm)

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(ctrlHotel.editForm))

router.route('/:id')
    .get(isLoggedIn, catchAsync(ctrlHotel.showHotel))
    .put(isLoggedIn, isOwner, upload.array('image'), catchAsync(ctrlHotel.updateHotel))
    .delete(isOwner, catchAsync(ctrlHotel.deleteHotel))




module.exports = router;