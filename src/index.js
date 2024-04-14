const connectMongoDB = require("./configs/ConnectMongoDB")
const express = require("express") 
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require('path')

const auth0 = require('./routes/auth0Routes')
const user = require('./routes/userRoutes')
const products = require('./routes/productRoutes')
const admin = require('./routes/adminRoutes')


const PORT = 5050
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'assets')))

//connect mongodb
connectMongoDB();


app.use('/api/auth0', auth0)
app.use('/api/users', user)
app.use('/api/products', products)
app.use('/api/admin', admin)



app.listen(PORT, () => {
    console.log(`Shoes website backend listening at http://localhost:${PORT}`)
})