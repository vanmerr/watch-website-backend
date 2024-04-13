const mongoose = require('mongoose');
const { Schema } = mongoose;
const CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number
    }

}, { timestamps: true })

module.exports = mongoose.model("Cart", CartSchema)