import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APIRequest } from "../api/APIRequest";

/* 초기값 */
const initialState = {
  orderId: null,
  orderName: null,
  amount: null,
  requestRes: {},
  confirmRes: {},
  paymentRes: {},
};

/* Actions */
export const postRequest = createAsyncThunk(
  "payment/postRequest",
  async ({ data }) => {
    return await APIRequest("POST", "/request", data);
  }
);

export const postConfirm = createAsyncThunk(
  "payment/postConfirm",
  async ({ data }) => {
    return await APIRequest("POST", "/confirm", data);
  }
);

/* Slice */
export const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    setOrderName: (state, action) => {
      state.orderName = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postRequest.fulfilled, (state, action) => {
      state.requestRes = action.payload;
    });
    builder.addCase(postConfirm.fulfilled, (state, action) => {
      state.confirmRes = action.payload;
    });
  },
});
export const { setOrderId, setOrderName, setAmount } = PaymentSlice.actions;

export default PaymentSlice.reducer;
