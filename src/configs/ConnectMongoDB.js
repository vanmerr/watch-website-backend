const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DATABASE = process.env.DATABASE_NAME;
const URL = process.env.MONGODB_URL;
mongoose.set('strictQuery', true);

const ConnectMongoDB = async () => {
    try {
        let db = await mongoose.connect(`${URL}/${DATABASE}`);
        console.log('Connected to MongoDB:', db.connection.host);
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};

module.exports = ConnectMongoDB;
