const express = require('express')
const { model } = require('mongoose')
require('dotenv').config()

const commentRouter = express.Router();

commentRouter.get('/:post_id',async (req,res)=>{

})

module.exports = commentRouter