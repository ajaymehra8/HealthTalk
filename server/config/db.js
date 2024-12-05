const mongoose=require("mongoose");

const db=async()=>{
    try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected successfully to database");
    }catch(err){
        console.log("Error in connecting database",err);
    }
}
module.exports=db;