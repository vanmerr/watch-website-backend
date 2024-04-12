const jwt = require("jsonwebtoken") 
const dotenv = require('dotenv');
dotenv.config()

const tokenAuthentication = async (req, res, next) => {

    const token = req.header('Authorization')
    if (!token) {
        return res.status(400).send("Access denied" )
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)

        //check JWT_EXPIRES_IN
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if(data.exp && data.exp < currentTimestamp) return res.status(401).json({error: 'Unauthorized'})

        req.user = data
        next()
    } catch (error) {
        res.status(400).send( "Access denied" )

    }
}

module.exports = tokenAuthentication