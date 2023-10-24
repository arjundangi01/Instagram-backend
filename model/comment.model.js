const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    authorID:{type:String,required:true},
    comment_like:Number
})

const commentModel=mongoose.model('comment',commentSchema);

module.exports=commentModel;
