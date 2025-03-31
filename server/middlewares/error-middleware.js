const errorMiddleware=(err,req,res,next)=>{
const status=err.status||500;
const message=err.message||"Something went wrong";
const extraDetails=err.extraDetails||"Error from backend";

return res.status(status).json({success:false,message,extraDetails});

}
module.exports=errorMiddleware;