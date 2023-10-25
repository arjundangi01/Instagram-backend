const express = require('express')
const { model } = require('mongoose');
const PostModel = require('../model/post.model');
const CommentModel = require('../model/comment.model');
const { authentication } = require('../middlewares/authentication.middleware');
require('dotenv').config()

const commentRouter = express.Router();

commentRouter.get('/:post_id',authentication,async (req,res)=>{
   try {
    const post_id=req.params.post_id;
    const comments=await CommentModel.find({postID:post_id});
    res.send(comments);
   } catch (error) {
    console.log(error);
   }
})

commentRouter.post('/:post_id',authentication,async (req,res)=>{
    try {
        const post_id=req.params.post_id;
        const input=req.body;
        const userId=req.userId;
        const new_obj={
            ...input,
            postID:post_id,
            user_id:userId
        }
        const comment=await CommentModel.create(new_obj);
        res.send("commented on post");
    } catch (error) {
        console.log(error);
    }
})

commentRouter.delete('/:comment_id',authentication,async (req,res)=>{
    try {
        const comment_id=req.params.comment_id;
        const comment=await CommentModel.deleteOne({_id:comment_id});
        res.send('deleted successfully');
    } catch (error) {
        console.log(error);
    }
})

module.exports = commentRouter