const jwt = require("jsonwebtoken") 
const dotenv = require('dotenv');

const User = require('../models/User')

dotenv.config()


const tokenAuthentication = async (req, res, next) => {

    const token = req.header('Authorization')
    if (!token) return res.status(400).json({ message:  "Access denied"} )
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)

        //check JWT_EXPIRES_IN
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (data.exp && data.exp < currentTimestamp) return res.status(401).json({error: 'Unauthorized'})

        req.user = data

        const user = await User.findById(req.user.id)
        if (user.isAdmin == true) next()
        else res.status(401).json({ message: 'Access denied'})
    
    } catch (error) {
        res.status(400).json({ message: 'Error Authorization' } )
    }
}

module.exports = tokenAuthentication