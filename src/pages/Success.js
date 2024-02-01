import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommonCSS from "../css/common.module.css";
import { useDispatch, useSelector } from "react-redux";
import { postConfirm, postPayment } from "../features/PaymentSlice";

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const userInfo = useSelector((state) => state.user.userInfo);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const orderName = searchParams.get("orderName");
  const amount = searchParams.get("amount");

  // useEffect(() => {
  //   // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터(orderId, amount)와 동일한지 반드시 확인
  //   // (클라이언트에서 결제 금액을 조작하는 행위를 방지 가능)
  //   if (orderUuid !== orderId || price !== amount) {
  //     navigate(`/fail?message=주문번호 혹은 금액이 요청 시와 다릅니다.&code=X`);
  //     return;
  //   }
  // }, []);

  const confirmPayment = async () => {
    const confirmData = {
      orderId: orderId,
      paymentKey: paymentKey,
      amount: amount,
    };

    const result = await dispatch(postConfirm({ confirmData }));
    const payload = result.payload;
    console.log("결제 승인 요청 결과: " + JSON.stringify(payload.data));

    let payYN;
    if (payload.status === 200) {
      setIsConfirmed(true);
      payYN = "Y";
    } else {
      navigate(
        `/fail?message=${payload.data.message}&code=${payload.data.code}`
      );
      payYN = "N";
    }

    const paymentData = {
      orderId: orderId,
      paymentKey: paymentKey,
      customerKey: userInfo.customerKey,
      orderName: orderName,
      amount: amount,
      payYN: payYN,
    };

    // 결제 결과 등록 API 호출
    dispatch(postPayment({ paymentData }));
  };

  return (
    <div>
      {isConfirmed ? (
        <div className={CommonCSS.onTheMiddle}>
          <img src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
          <h2>결제를 완료했어요!</h2>
          <div style={{ textAlign: "left" }}>
            <p>
              주문 번호: <span>{orderId}</span>
            </p>
            <p>
              주문 명: <span>{orderName}</span>
            </p>
            <p>
              결제 금액: <span>{amount}</span>
            </p>
            <p>
              paymentKey: <span>{paymentKey}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className={CommonCSS.onTheMiddle}>
          <img src="https://static.toss.im/lotties/loading-spot-apng.png" />
          <div style={{ textAlign: "center" }}>
            <h2>결제 요청까지 성공했어요!</h2>
            <p>결제를 승인하고 완료해보세요 :)</p>
            <button onClick={confirmPayment}>결제 승인하기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
