const mongoose=require('mongoose');

const reviewSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        max:5,
        min:1
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
        },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

})
module.exports=mongoose.model('Review',reviewSchema);