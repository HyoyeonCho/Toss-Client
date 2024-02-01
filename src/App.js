import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Payday from "./pages/Payday";
import Success from "./pages/Success";
import Fail from "./pages/Fail";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Payday />} />
          <Route path="/success" element={<Success />} />
          <Route path="/fail" element={<Fail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
