import { combineReducers } from "@reduxjs/toolkit";
import paymentReducer from "./PaymentSlice";
import userReducer from "./UserSlice";

const RootReducer = combineReducers({
  payment: paymentReducer,
  user: userReducer,
});

export default RootReducer;
