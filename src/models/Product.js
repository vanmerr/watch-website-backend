const CategoryEnum = require("../enums/Category")
const BrandEnum = require('../enums/Brand')

const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductSchema = new Schema({
    name: String,
    brand: { type: String, enum: Object.values(BrandEnum) },
    price: Number,
    imageURL: String,
    category: { type: String, enum: Object.values(CategoryEnum) },
    description: String,
    quantity : Number
})

module.exports = mongoose.model("Product", ProductSchema)