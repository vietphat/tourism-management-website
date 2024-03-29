const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A booking must belongs to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A booking must belongs to a user'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Customer phone number is required'],
  },
  price: {
    type: Number,
    required: [true, 'A booking must has a price'],
  },
  ticketsQuantity: {
    type: Number,
    required: [true, 'Đơn đặt tour phải có số lượng vé'],
  },
  totalMoney: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// 1 người dùng chỉ đặt tour đó 1 lần
bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

// Tính thành tiền trước khi lưu
bookingSchema.pre('save', function (next) {
  this.totalMoney = this.price * this.ticketsQuantity;
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
