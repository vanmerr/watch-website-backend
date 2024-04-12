const express = require('express')
const jwt = require("jsonwebtoken")
const router = express.Router()
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const dotenv = require('dotenv')

const User = require('../models/User')
const tokenAuthentication = require('../middlewares/auth0User')

dotenv.config()



//login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    
    
    const errors = validationResult(req)

    if(!errors.isEmpty()) return res.status(400).json({error: errors.array() }) 


    const { email, password }  = req.body

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({error: "User not found" })
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({error: "Incorrect password" })
        }
        
        const data = {
            userId : user.id
        }

        const expiresIn = process.env.JWT_EXPIRES_IN
        const issuer = process.env.JWT_ISSUER

        const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn, issuer})

        res.status(200).json({ token: authToken})
    }
    catch (error) {
        res.status(500).json({error: "Internal server error"})
    }

})


//register
router.post('/register',[
    body('fullName', 'Enter a valid full name').isLength({min : 1}),
    body('phoneNumber', 'Enter a valid phone number').isMobilePhone('vi-VN'),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters').isLength({min : 8})
], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) return res.status(400).json({error: errors.array()})

    const { fullName, phoneNumber, email, password, address, isAdimn} = req.body

    try {
        const userExists = await User.findOne({ $or: [{ email: email }, { phoneNumber: phoneNumber }] })

        if(userExists) return res.status(400).json({error: 'Sorry a user already exists'})


        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(password, salt)

        const createUserPromise = await User.create({
            fullName,
            phoneNumber,
            email,
            password: hassPassword,
            address,
            isAdimn
        })


        const data = {
            userId : createUserPromise.id
        }

        const expiresIn = process.env.JWT_EXPIRES_IN
        const issuer = process.env.JWT_ISSUER

        const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn, issuer})

        res.status(201).json({ token: authToken})

    } catch (error) {
        res.status(500).json({error : `Internal server error ${error}`})
    }
})

//logged in user details
router.get('/getuser', tokenAuthentication, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password")
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({ error: `${error}`})
    }
})


module.exports = router