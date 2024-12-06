const Order=require("../models/orderModel");
const Product=require("../models/productModel");
const User=require("../models/userModel");
const ErrorHander=require("../utils/errorhander")
const catchAsyncErrors=require("../middleware/catchAsyncErrors");

//create new order
exports.newOrder=catchAsyncErrors(async(req,res,next)=>{
    console.log(req.user);
    const{
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    }=req.body;
    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });
    res.status(200).json({
        success:true,
        order,
    });
});
//get single order
exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{
    // console.log("hii");
  const order=await Order.findById(req.params.id).populate("user","name email");
  if(!order){
    return next(new ErrorHander("Order not Found with this Id",404))
  }
  res.status(200).json({
    success:true,
    order,
  });
})
//get logged in user Orders
exports.myOrders=catchAsyncErrors(async(req,res,next)=>{
  
  const orders=await Order.find({user:req.user._id})
 
  res.status(200).json({
    success:true,
    orders,
  });
})
//get all Orders--admin
exports.getAllOrders=catchAsyncErrors(async(req,res,next)=>{
   
  const orders=await Order.find()
  let totalAmount=0;
  orders.forEach((order)=>{
    totalAmount+=order.totalPrice;
  })

  res.status(200).json({
    success:true,
    totalAmount,
    orders,
  });
})
//update orders status--admin
exports.updateOrder=catchAsyncErrors(async(req,res,next)=>{
   
  const order=await Order.findById(req.params.id)
  if(!order){
    return next(new ErrorHander("Order not found with this Id",404))
  }
  if(order.orderStatus==="Delivered"){
    return next(new ErrorHander("You have already delivered this order",400));
  }
  order.orderItems.forEach(async(order)=>{
     await updateStock(order.product,order.quantity);
  });
  
  order.orderStatus=req.body.status;
  if(req.body.status==="Delivered"){
    order.deliveredAt=Date.now();
  }
  await order.save({validateBeforeSave:false});
  res.status(200).json({
    success:true,
  });
})

async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.Stock=product.Stock-quantity;
   await product.save({validateBeforeSave:false});
}
//delete order--admin
exports.deleteOrder=catchAsyncErrors(async(req,res,next)=>{
   
  const order=await Order.findById(req.params.id)
  if(!order){
    return next(new ErrorHander("Order not found with this Id",404))
  }
  await order.deleteOne();

  res.status(200).json({
    success:true,
  });
})