const mongoose = require('mongoose')
require('dotenv').config()

const connection = mongoose.connection(`${process.env.MONGO_URI}/Instagram`);

module.exports = connection