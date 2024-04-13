const express = require('express');
const router = express.Router();

const Cart = require('../models/Cart')
const tokenAuthentication = require('../middlewares/auth0User')

//get carts by userId
router.get('/get-cart', tokenAuthentication, async ( req, res) => {
    try {
        const carts = await Cart.find({ userId: req.body.id})
            .populate('productId', 'name imageURL price quantity')
            .populate('userId', 'fullName email')

        res.status(200).json({ data: carts})

    } catch (error) {
        res.status(400).json({ message: `${error}`})
    }
})

// add product to cart
router.post('/add-cart', tokenAuthentication, async (req, res) => {
    const { id, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ productId: id, userId: req.user.id });

        if (cart) cart.quantity += quantity;
        else {
            cart = new Cart({
                productId: id,
                userId: req.user.id,
                quantity: quantity
            });
        }
        await cart.save();

        res.status(200).json({ message: "Cart updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// remove cart
router.delete('/delete-cart', tokenAuthentication, async ( req, res) => {
    const { id } = req.params
    try {
        const result = await Cart.findByIdAndDelete(id)
        res.json({ message: result })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'});
    }
})  
