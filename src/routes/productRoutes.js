const express = require('express');
const router = express.Router();

const Product = require('../models/Product')

//get all products
router.get('/get-all', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json({data : products})
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
})

//get product by id
router.get('/get/:id', async( req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        res.status(200).json({data : product})
    } catch (error) {
        res.status(400).json({ message: `${error}`})
    }
})

// get products by category
router.post('/get/category', async (req, res) => {
    const { category } = req.body
    try {
        const products = await Product.find({ category: `${category}`})
        res.status(200).json({ data : products})
    } catch (error) {
        res.status(400).json({ message: `${error}`})
    }
})

// get products by categry and brand
router.post('/get/category-brand', async ( req, res) => {
    const { category, brand} = req.body
    let products
    try {
        if ( category === 'Other') products = await Product.find({ brand: `${brand}`})
        else products = await Product.find({ $and : category, brand})
        res.json({ data: products})
    } catch (error) {
        
    }
})

//search products
router.get('/search/:key', async (req, res) => {
    const {key } = req.params

    if(key.length <= 0 ) res.status(400).json({ message: 'Key cannot be empty'})

    let products
    try {

        if(!isNaN(parseFloat(key)))
            products = await Product.find({ price: { $eq: parseFloat(key) }})
        else products = await Product.find({ 
                $or: [
                    { name: { $regex: key, $options: "i" } },
                    { brand: { $regex: key, $options: "i" } },
                    { category: { $regex: key, $options: "i" } }
                ]   
            })

        res.status(200).json({ data: products})
        
    } catch (error) {
        res.status(400).json({ message: `${error}`})
    }
})




module.exports  = router