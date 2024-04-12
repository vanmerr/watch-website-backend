const StatusOrderEnum = require("../enum/StatusOrder")
const mongoose = require('mongoose')
const { Schema } = mongoose



const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number
    },
    status:{ 
        type: String, 
        enum: Object.values(StatusOrderEnum),
        default: 'PENDING'
    },
    total : {
        type: Number
    }

}, { timestamps: true })

module.exports = mongoose.model("Order", OrderSchema)