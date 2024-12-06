import React, { Fragment, useEffect,useState } from 'react'
import Carousel from "react-material-ui-carousel"
import { Link, useParams } from 'react-router-dom';
import "./ProductDetails.css"
import { useDispatch, useSelector } from "react-redux"
import { getProductDetails,clearErrors } from '../../actions/productAction';
import ReactStars from "react-rating-stars-component";
import { Rating } from "@material-ui/lab";
import ReviewCard from './ReviewCard.js'
import Loader from "../layout/loader/Loader"
import {useAlert} from "react-alert"
import MetaData from '../layout/MetaData';
import { addItemsToCart } from '../../actions/cartAction';

const ProductDetails = ({ match }) => {
  
  const dispatch = useDispatch();
  const { id } = useParams();
  const alert=useAlert();
  const { product, loading, error } = useSelector((state) => state.productDetails)
  
  useEffect(() => {
    if(error){
        alert.error(error)
        dispatch(clearErrors())
    }
    dispatch(getProductDetails(id));
  }, [dispatch,id,alert,error]);
  
  let options;
 
if(!loading)
  {

     options = {
      edit:false,
      color:"rgba(20,20,20,0.1)",
      activeColor:"tomato",
      size:window.innerWidth<600 ? 20 :25,
      value: product && product.ratings,
      isHalf:true
    };
  }

  const [quantity ,setQuantity]=useState(1);
  
  

const increaseQuantity=()=>{
  if(product && quantity>=product.Stock) return;

  const qty=quantity+1;
  setQuantity(qty); 
}
const decreaseQuantity=()=>{
  if(quantity<=1) return;
  const qty=quantity-1;
  setQuantity(qty); 
}
const addToCartHandler=()=>{
  dispatch(addItemsToCart(id,quantity))
  alert.success("items added to cart");
}
  return (
   <Fragment>
    {loading?<Loader/> :
     <Fragment>
      <MetaData title={`${product.name} --ECOMMERCE`}/>
    
     <div className="ProductDetails">
       <div>
         <Carousel>
           {product.images &&
             product.images.map((item, i) => (
               <img
                 className="CarouselImage"
                 key={i}
                 src={item.url}
                 alt={`${i} Slide`}
               />
             ))}
         </Carousel>
       </div>


       <div>

         <div className="detailsBlock-1">
           <h2>{product.name}</h2>
           <p>Product # {product._id}</p>
         </div>
         <div className="detailsBlock-2">
           <ReactStars {...options} />
           <span className="detailsBlock-2-span">({product.numOfReviews} Reviews)</span>
         </div>

         <div className="detailsBlock-3">
           <h1>{`₹${product.price}`}</h1>
           <div className="detailsBlock-3-1">
             <div className="detailsBlock-3-1-1">
               <button onClick={decreaseQuantity}>-</button>
               <input readOnly value={quantity} type="number" />
               <button onClick={increaseQuantity}>+</button>
             </div>
             <button onClick={addToCartHandler}>Add to Cart</button>
           </div>

           <p>
             Status:
             <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
               {product.stock < 1 ? "OutOfStock" : "InStock"}
             </b>
           </p>
         </div>

         <div className='detailsBlock-4'>
           Description : <p>{product.description}</p>
         </div>
         <button className='submitReview'>Submit Review</button>
       </div>
     </div>
     <h3 className='reviewsHeading'>REVIEWS</h3>
     {product.reviews && product.reviews[0] ? (
       <div className="reviews">
         {product.reviews && 
           product.reviews.map((review)=><ReviewCard review={review}/>)}
       </div>
     ):(
       <p className='noReviews'>No Reviews Yet</p>
     )}
   </Fragment>}
   </Fragment>
  )
}

export default ProductDetails