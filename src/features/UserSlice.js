import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APIRequest } from "../api/APIRequest";
import { PaymentSlice } from "./PaymentSlice";

/* 초기값 */
const initialState = {
  // [임시] 결제 과정에서 필요한 최소한의 구매자 정보
  userInfo: {
    customerKey: "IiyM24FjYF8aTF8MudjK6",
    name: "신짱구",
    email: "payday@gmail.com",
    phone: "010-1234-5678",
  },
};

/* Actions */
// 구매자의 customerKey, name, email, phone을 조회하는 API 호출
export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
  return await APIRequest("GET", "/info");
});

/* Slice */
export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
  },
});

export default UserSlice.reducer;
