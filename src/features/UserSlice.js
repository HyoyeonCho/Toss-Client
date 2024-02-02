import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APIRequest } from "../api/APIRequest";

/* 초기값 */
const initialState = {
  userInfo: {}
};

/* Actions */
// 결제 시 필요한 사용자의 정보(customerKey, name, email, phone)를 조회하는 API를 호출합니다.
export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
  return await APIRequest("GET", "/userInfo");
});

/* Slice */
export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload.data;
    });
  },
});

export default UserSlice.reducer;
