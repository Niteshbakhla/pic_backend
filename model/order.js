const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
            {
                        userId: {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: 'User',
                                    required: true,
                        },
                        nameOfBuyer: {
                                    type: String,
                                    required: true
                        },
                        postId: {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: 'Post',
                                    required: true,
                        },
                        postUrl: {
                                    type: String,

                        },
                        author: {
                                    type: String,
                                    required: true,
                        },
                        title: {
                                    type: String,
                                    required: true,
                        },
                        price: {
                                    type: Number,
                                    required: true,
                        },
                        reciept: {
                                    type: String,
                                    required: true
                        },
                        stripeSessionId: {
                                    type: String,

                        },
                        paymentStatus: {
                                    type: String,
                                    enum: ['pending', 'paid', 'failed'],
                                    default: 'pending',
                        },
                        createdAt: {
                                    type: Date,
                                    default: Date.now,
                        },
            },
            { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
