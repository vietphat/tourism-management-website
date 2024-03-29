const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/checkout-session/:tourId/:ticketsQuantity')
  .get(
    bookingController.checkIfThereAreTicketsAvailable,
    bookingController.getCheckoutSession
  );

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(
    bookingController.checkIfThereAreTicketsAvailable,
    bookingController.createBooking
  );

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
