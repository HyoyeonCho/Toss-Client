import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Payday from "./pages/Payday";
import Success from "./pages/Success";
import Fail from "./pages/Fail";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "./features/UserSlice";

const App = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    // 결제 시 필요한 현재 사용자의 정보를 조회합니다.
    dispatch(getUserInfo());
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Payday />} />
          {/* requestPayment() 호출 후 돌아오는 리다이렉트 URL의 라우터 설정이 필요합니다. */}
          <Route path="/success" element={<Success userInfo={userInfo} />} />
          <Route path="/fail" element={<Fail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
