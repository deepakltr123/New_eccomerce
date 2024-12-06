const ErrorHandler=require("../utils/errorhander.js")

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "internal server Error";
    if(err.name=="CastError"){
        const message=`Resource not found, Invalid: ${err.path}`
        err=new ErrorHandler(message,400);
    }
    //Mongoose duplicate key error
    if(err.code===11000){
        const message=`Duplicate ${object.keys(err.keyValue)} Entered`;
        err=new ErrorHandler(message,400);
    }
    //wrong jwtToken
    if(err.name==="JsonWebTokenError"){
        const message="Json web Token is invalid, Try again";
        err=new ErrorHandler(message,400);
    }
    //JWT TOKEN EXPIRE
    if(err.name==="TokenExpiredError"){
       const message="Json web Token is Expired, Try again";
       err=new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    });
}