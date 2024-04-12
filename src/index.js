const connectMongoDB = require("./configs/ConnectMongoDB")
const express = require("express") 
const cors = require("cors")
const bodyParser = require("body-parser")

const auth0 = require('./routes/auth0Routes')
const products = require('./routes/productRoutes')


const PORT = 5050
const app = express()

app.use(cors())
app.use(bodyParser.json())


//connect mongodb
connectMongoDB();



app.use('/api/auth0', auth0)
app.use('/api/products', products)



app.listen(PORT, () => {
    console.log(`Shoes website backend listening at http://localhost:${PORT}`)
})