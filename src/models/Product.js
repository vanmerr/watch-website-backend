const CategoryEnum = require("../enum/Category")
const BrandEnum = require('../enum/Brand')

const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductSchema = new Schema({
    name: String,
    brand: { type: String, enum: Object.values(BrandEnum) },
    price: Number,
    image: String,
    category: { type: String, enum: Object.values(CategoryEnum) },
    description: String,
    quantity : Number
})

module.exports = mongoose.model("Product", ProductSchema)