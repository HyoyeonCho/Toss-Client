import { combineReducers } from "@reduxjs/toolkit";
import paymentReducer from "./PaymentSlice";
import userReducer from "./UserSlice";

const RootReducer = combineReducers({
  // 왼편에 위치한 변수는 컴포넌트 내에서 useSelector로 해당 Reducer를 호출할 때 사용되는 key
  payment: paymentReducer,
  user: userReducer,
});

export default RootReducer;
