const express = require('express')
const { model } = require('mongoose')
require('dotenv').config()

const commentRouter = express.Router()

module.exports = commentRouter