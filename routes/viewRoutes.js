const express = require('express');
const viewsController = require('../controllers/viewsController');
const authCotroller = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  viewsController.getOverview,
);
router.get('/tour/:slug', viewsController.getTour);
router.get('/my-tours', authCotroller.protect, viewsController.getMyTours);

module.exports = router;
