const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const User=require("../models/userModel.js");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto=require("crypto");
const cloudinary=require("cloudinary");

//Register a user
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    });
    const{name,email,password}=req.body;
    console.log(myCloud)
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        },
    });
    sendToken(user,201,res);
});

//login user
exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body
    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHander("Please Enter Email & password",400))
    /* new ErrorHander("Please Enter Email & password",400):-  create instances of custom error
     objects with a message and a status code.  */
    /*The next function passes this error to the next middleware or 
    error-handling middleware(in app.js) in the Express.js middleware stack. */
    /* app.use(errorMiddleware):- errorMiddleware will be called and receives the ErrorHander instance
    (error object having message and status code) as the err parameter. Then message will be customized according to the types and printed*/

    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHander("Invalid Email or password",401))
    }

    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid Email or password",401))
    }
    sendToken(user,200,res);
})
//logout user
exports.logout=catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
         expires:new Date(Date.now()),
         httpOnly:true,
    })
    res.status(200).json({
       success:true,
       message:"Logged Out"
    })
})

//to reset forgot password
exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    // console.log(user);
    if(!user){
        return next(new ErrorHander("User not found",404));
    }
    //get Reset password token
     const resetToken=user.getResetPasswordToken();
     await user.save({validateBeforeSave:false});
     const resetPasswordUrl=`${process.env.FRONTENED_URL}/password/reset/${resetToken}`;
     const message=`Your password reset token is:- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email
     then,please ignore it`

     try{
         await sendEmail({
           email:user.email,
           subject:`Ecommerce password recovery`,
           message,
         })
         res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
         })
     }
     catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
       
        return next(new ErrorHander(error.message,500));
     }
    
})

//Reset password
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{
    //creating token hash
    const resetPasswordToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });
    // console.log(user);
    if(!user){
        return next(new ErrorHander("Reset Password Token is Invalid or has been Expired",400))
    }
    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHander("Password doesn't match",400))
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined
    await user.save();
    // console.log(user);
    sendToken(user,200,res);
})
//get user details
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user,
    });
})  

//Update user password
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHander("old password is Incorrect",400));
    }
    if(req.body.confirmPassword!=req.body.newPassword){
        return next(new ErrorHander("password doesn't match",400));
    }
    user.password=req.body.confirmPassword;
    await user.save();
    sendToken(user,200,res);
})

//update user profile
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
       name:req.body.name,
       email:req.body.email,
    };
    
    console.log(newUserData.name);
    console.log(newUserData.email);

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
        
        await cloudinary.v2.uploader.destroy(imageId);
         
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    });
})
//Get all users(admin)
exports.getAllUser=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users,
    });
})
//Get single user(admin)
exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
   const user=await User.findById(req.params.id);
   if(!user){
    return next(new ErrorHander(`User doesn't exist with id:${req.params.id}`));
   }
   res.status(200).json({
    success:true,
    user,
   });
}) ;
//update user roles(admin)
exports.updateUserRole=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
       name:req.body.name,
       email:req.body.email,
       role:req.body.role,
    };
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    });
})

//delete user--admin
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user =User.findById(req.params.id);
    if(!user){
        return next(new ErrorHander(`User doesn't exist with id: ${req.params.id}`))
    }
    await user.findOneAndRemove();
    res.status(200).json({
        success:true,
        message:"User deleted successfully",

    })

})