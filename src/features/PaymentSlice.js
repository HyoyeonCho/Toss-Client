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
  async ({ requestData }) => {
    return await APIRequest("POST", "/request", requestData);
  }
);

export const postConfirm = createAsyncThunk(
  "payment/postConfirm",
  async ({ confirmData }) => {
    return await APIRequest("POST", "/confirm", confirmData);
  }
);

export const postPayment = createAsyncThunk(
  "payment/postPayment",
  async ({ paymentData }) => {
    return await APIRequest("POST", "/payment", paymentData);
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
    builder.addCase(postPayment.fulfilled, (state, action) => {
      state.paymentRes = action.payload;
    });
  },
});
export const { setOrderId, setOrderName, setAmount } = PaymentSlice.actions;

export default PaymentSlice.reducer;
