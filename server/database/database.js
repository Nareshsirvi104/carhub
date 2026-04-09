const mongoose = require('mongoose');

const connection = async () => {
    try {
        console.log("ENV CHECK:", process.env.MONGO_URL);

        await mongoose.connect("mongodb://127.0.0.1:27017/carDB")// ✅ FIXED

        console.log('MongoDB Connected ✅');
    } catch (err) {
        console.log('Connection Failed ❌', err);
    }
};

module.exports = connection;