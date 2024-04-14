const express = require('express')
const router = express.Router()


const User = require('../models/User')
const tokenAuthentication = require('../middlewares/auth0User')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const { Promise } = require('mongoose')


//logged in user details
router.get('/get', tokenAuthentication, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password").select('-_id')
        res.status(200).json({data: user})

    } catch (error) {
        res.status(404).json({ message: `${error}`})
    }
})

// update info
router.put('/update-info', tokenAuthentication , async (req, res) => {
    const { fullName, avartarURL, address } = req.body
    try {
        let user = await User.findById(req.user.id).select('-password')
        if(!user) return res.status(400).json({ message: 'Access denied'})
        user.fullName = fullName || user.fullName
        user.avartarURL = avartarURL || user.avartarURL
        user.address = address || user.address
        const result = await user.save()

        res.status(200).json({ data : result})
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

// order
router.post('/order', tokenAuthentication, async (req, res) => {
    const { productId, quantity } = req.body
    try {
        // update quantity for product
        const product = await Product.findById(productId)
        if (quantity > product.quantity) return res.status(400).json({ message: 'Insufficient inventory'})
        product.quantity -= quantity
        const result = await product.save()

        //delete product from cart 
        const cart = await Cart.findOneAndDelete({ userId: req.user.id, productId: productId})

        // add order
        const order = await Order.create({
            userId : req.user.id,
            productId,
            quantity,
            total : product.price * quantity,
        })

        const orderData = order.toObject();
        delete orderData.userId; 



        res.status(200).json({ data: orderData, delete: cart, update: result})
        
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

// get all order by user
router.get('/history-order', tokenAuthentication, async ( req, res) => {
    const  status  = req.query.status
    let orders
    try {
        if (status) orders = await Order.find({ userId: req.user.id, status : status}).select('-userId')
        else orders = await Order.find({ userId: req.user.id}).select('-userId')
        res.status(200).json({ data: orders})
    } catch (error) {
        res.status(400).json({ message: error})
    }
})

// cancel order
router.get('/cancel-order', tokenAuthentication, async ( req, res) => {
    const  id  = req.query.id
    try {
        // cancal order
        const order = await Order.findById(id).select('-userId')
        if(order.status === 'Failed') return res.status(400).json({ message: 'Order has been cancelled'})
        order.status = 'Failed'
        order.save()

        // update quantity for product

        const product = await Product.findById(order.productId)
        product.quantity += order.quantity
        const result = await product.save()

        res.status(201).json({ data: order, update: result })
    } catch (error) {
        res.status(400).json({ message: error})
    }
})


//get carts by user
router.get('/get-cart', tokenAuthentication, async ( req, res) => {
    try {
        const carts = await Cart.find({ userId: req.user.id}).select('-userId')
            .populate('productId', 'name imageURL price quantity')

        res.status(200).json({ data: carts})

    } catch (error) {
        res.status(400).json({ message: `${error}`})
    }
})

// add product to cart
router.post('/add-cart', tokenAuthentication, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ productId: productId, userId: req.user.id });

        if (cart) cart.quantity += quantity;
        else {
            cart = new Cart({
                productId,
                userId: req.user.id,
                quantity
            });
        }
        await cart.save();

        res.status(200).json({ data: cart});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// remove cart
router.delete('/delete-cart', tokenAuthentication, async ( req, res) => {
    const  id  = req.query.id
    try {
        const result = await Cart.findByIdAndDelete(id)
        res.json({ message: result })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'});
    }
})  

module.exports = router