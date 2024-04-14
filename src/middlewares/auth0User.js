const jwt = require("jsonwebtoken") 
const dotenv = require('dotenv');
dotenv.config()

const tokenAuthentication = async (req, res, next) => {

    const token = req.header('Authorization')
    if (!token) {
        return res.status(400).json({ message: 'Access denied 1' })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)

        //check JWT_EXPIRES_IN
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if(data.exp && data.exp < currentTimestamp) return res.status(401).json({ message : 'Unauthorized'})

        req.user = data
        next()
    } catch (error) {
        return res.status(400).json({ message: 'Access denied' })
    }
}

module.exports = tokenAuthentication