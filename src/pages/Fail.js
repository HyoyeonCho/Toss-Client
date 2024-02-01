import React from "react";
import { useSearchParams } from "react-router-dom";
import CommonCSS from "../css/common.module.css";

const Fail = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <div className={CommonCSS.onTheMiddle}>
      <img src="https://static.toss.im/lotties/error-spot-apng.png" />
      <h2>결제를 실패했어요 :(</h2>
      <div style={{ textAlign: "left" }}>
        <p>
          에러 코드: <span>{errorCode}</span>
        </p>
        <p>
          에러 메세지: <span>{errorMessage}</span>
        </p>
      </div>
    </div>
  );
};

export default Fail;
