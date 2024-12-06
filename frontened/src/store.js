import {createStore,combineReducers,applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import { productReducer } from "./reducers/productReducer";
import { productDetailsReducer } from "./reducers/productReducer";
import { profileReducer, userReducer ,forgotPasswordReducer} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { newOrderReducer,myOrdersReducer } from "./reducers/orderReducer";


const reducer=combineReducers({
    products:productReducer,
    productDetails:productDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newOrder:newOrderReducer,
    myOrders: myOrdersReducer,
});//it combines the various reducers

let initialState={
    cart: {
        cartItems: localStorage.getItem("cartItems")
          ? JSON.parse(localStorage.getItem("cartItems"))
          : [],
        shippingInfo: localStorage.getItem("shippingInfo")
          ? JSON.parse(localStorage.getItem("shippingInfo"))
          : {},
      },
};
const middleware=[thunk];

const store=createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))  //The composeWithDevTools function is used to enhance the store with the Redux DevTools extension.
);
export default store; 