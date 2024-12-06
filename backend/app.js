const express=require('express');
const cookieParser=require("cookie-parser")
const dotenv=require('dotenv');
const app=express();
const errorMiddleware=require("./middleware/error.js")
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload")

dotenv.config({path:"backend/config/config.env"});
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload())
//Route import
const product=require("./routes/productRoute.js");
const user=require("./routes/userRoute.js");
const order=require("./routes/orderRoute.js");
const payment=require("./routes/paymentRoute.js")

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment)
//middleware for error
app.use(errorMiddleware);

module.exports=app