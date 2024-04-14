const express = require('express');
const router = express.Router();

const Product = require('../models/Product')

//get all products
router.get('/get', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json({data : products})
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
})

// get products by categry, brand and id
router.get('/get-by', async ( req, res) => {
    const { category, brand, id } = req.query
    let products
    try {
        if (id) products = await Product.findById(id)
        else if (brand) {
            if ( category === 'Other') products = await Product.find({ brand: `${brand}`})
            else products = await Product.find({ $and : [{ category : category}, { brand: brand }]})
        }
        else {
            if ( category === 'Other') products = await Product.find()
            else products = await Product.find({category : category})
        }
        res.json({ data: products})
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

//search products
router.get('/search', async (req, res) => {
    const key = req.query.value

    if(key.length <= 0 ) res.status(400).json({ message: 'Key cannot be empty'})

    let products
    try {

        if(!isNaN(parseFloat(key)))
            products = await Product.find({ price: { $gte: parseFloat(key) }})
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