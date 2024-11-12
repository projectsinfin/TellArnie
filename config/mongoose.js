const config = require('./config');
mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect(config.DB_URL);
        console.log(` DataBase Conneted`);
    } catch (error) {
        console.log(`Error in Mongodb ${error}`);
    }
};

module.exports = connectDb;