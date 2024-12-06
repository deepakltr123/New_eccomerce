const Product = require("../models/productModel.js");
const ErrorHander = require("../utils/errorhander.js");
const catchAsyncErrors=require("../middleware/catchAsyncErrors.js");
const ApiFeatures = require("../utils/apifeatures.js");

//create products--- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user=req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

//get all products
exports.getAllProducts = catchAsyncErrors(async (req, res,next) => {
   const resultPerPage=4;
   const productsCount=await Product.countDocuments();
    const apiFeature=new ApiFeatures(Product.find(),req.query).search().filter();
    
    let products=await apiFeature.query;
    let filteredProductsCount=products.length;
    apiFeature.pagination(resultPerPage);
     products = await apiFeature.query.clone();
//    const products=await Product.find();         
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
})
//get product details
exports.getProductDetails=catchAsyncErrors(async (req,res,next)=>{
    
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404))
    }
    res.status(200).json({ 
        success:true,
        product
    })
})

//update products -- admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
   
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success:true,
        product
    })

}
)
//Delete product 
exports.deleteProduct=catchAsyncErrors(async (req,res,next)=>{
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return next(new ErrorHander("Product not found",404))
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the product",
            error: error.message,
        });
    }
})

//create new review or update review
exports.createProductReview=catchAsyncErrors(async(req,res,next)=>{
    const {rating ,comment,productId}=req.body;
    const review={
       user:req.user._id,
       name:req.user.name,
       rating:Number(rating),
       comment,
    }
    const product=await Product.findById(productId);
    const isReviewed=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString())
    if(isReviewed){
       product.reviews.forEach((rev)=>{
          if(rev.user.toString()===req.user._id.toString()){
            (rev.rating=rating),(rev.comment=comment);
          }
       });
    
    }
    else {
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach((rev)=>{
        avg+=rev.rating;
    });
    product.ratings=avg/product.reviews.length;


    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })
})

//get All review of a product
exports.getProductReviews=catchAsyncErrors(async(req,res,next)=>{
    console.log(req.query);
    const product=await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHander("Product not found",404))
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })
})

//delete Review
exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }
    const reviews=product.reviews.filter((rev)=>rev.id.toString()!==req.query.id.toString());//id is review id
    
    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating;
    });
    const ratings=avg/reviews.length;
    const numOfReviews=reviews.length;;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    
    res.status(200).json({
        success:true,
        message:"Your review deleted successfully"
    })
})