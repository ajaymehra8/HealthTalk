const mongoose=require("mongoose");

const reportSchema=new mongoose.Schema({
    report:{
        type:String,
        required:true,
        minLength:5,
        maxLength:150
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true});

module.exports=mongoose.model('Report',reportSchema);