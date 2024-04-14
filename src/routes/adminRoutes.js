const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

const Product = require('../models/Product')
const User = require('../models/User')
const Order = require('../models/Order')
const tokenAuthentication = require('../middlewares/auth0Admin');

// get all user
router.get('/get-all-user', tokenAuthentication, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ data: users}); 
    } catch (error) {
        res.status(400).json({ message: 'Server error'})
    }
});

// post user by admin
router.post('/add-user', tokenAuthentication, async ( req, res) => {


    const { fullName, phoneNumber, email, password, address, isAdmin } = req.body
    try {
        const userExists = await User.findOne({ $or: [{ email: email }, { phoneNumber: phoneNumber }] })

        if ( userExists ) return res.status(400).json({ message: 'Sorry a user already exists'})


        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName,
            phoneNumber,
            email,
            password: hassPassword,
            address,
            isAdmin
        })
        
        res.status(201).json({ data : newUser})

    } catch (error) {
        res.status(400).json({ message: 'Error add user' })
    }
})

// update user by admin
router.put('/update-user', tokenAuthentication, async ( req, res) => {
    const { id ,fullName, avartarULR, address, isAdmin } = req.body

    let user = await User.findById(id).select('-password')
    if(!user) return res.status(400).json({ message: 'User not found'})

    try {

        user.fullName = fullName ? fullName : user.fullName
        user.avartarURL = avartarULR ? avartarULR : user.avartarURL
        user.address = address ? address : user.address
        user.isAdmin = isAdmin ? isAdmin : user.isAdmin

        await user.save()

        res.status(200).json({ data: user})

        
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

// delete user by admin using id
router.delete('/delete-user', tokenAuthentication, async ( req, res) => {
    let  id  = req.query.id
    try {
        const result = await User.findByIdAndDelete(id)
        res.status(200).json({ message : result})
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

// add product by admin
router.post('/add-product', tokenAuthentication, async ( req, res) => {
    const { name, brand, price, imageURL, category, description, quantity} = req.body
    try {
        const newProduct = await Product.create({
            name,
            price,
            brand,
            category,
            description,
            imageURL,
            quantity
        })


        res.status(201).json({ data: newProduct})
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

// updata product
router.put('/update-product', tokenAuthentication, async (req, res) => {
    const { id, name, brand, price, imageURL, category, description, quantity} = req.body
    try {
        const updateProduct = await Product.findById(id)

        if( !updateProduct) res.status(400).json({ message: 'Product not found'})

        updateProduct.name = name || updateProduct.name
        updateProduct.brand = brand || updateProduct.brand
        updateProduct.price = price || updateProduct.price
        updateProduct.imageURL = imageURL || updateProduct.imageURL
        updateProduct.category = category || updateProduct.category
        updateProduct.description = description || updateProduct.description
        updateProduct.quantity = quantity || updateProduct.quantity

        const result = await updateProduct.save()
        res.status(200).json({ data: result})
    } catch (error) {
        re.status(400).json({ message: error})
    }
})

// delete product by admin
router.delete('/delete-product', tokenAuthentication, async (req, res) => {
    const id = req.query.id
    try {
        const result = await Product.findByIdAndDelete(id)
        res.status(200).json({ message: result})
    } catch (error) {
        res.status(400).json({ message: error})
    }
})


// get all order by admin
router.get('/get-all-order', tokenAuthentication, async (req, res) => {
    const status = req.query.status
    let orders
    try {
        if (status) orders =  await Order.find({ status: status})
        else orders = await Order.find();
        res.status(200).json({ data: orders})
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

// update order by admin
router.put('/update-order-status', tokenAuthentication, async ( req, res) => {
    const { id,  status } = req.body
    try {
        const order = await Order.findById(id)
        order.status = status
        order.save()

        res.status(200).json({ data: order})
    } catch (error) {
        res.status.json({ message: ' Update failed'})
    }
} )



module.exports = router