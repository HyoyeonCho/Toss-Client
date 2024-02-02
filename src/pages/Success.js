import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommonCSS from "../css/common.module.css";
import { useDispatch, useSelector } from "react-redux";
import { postConfirm, postPayment } from "../features/PaymentSlice";

const Success = ({ userInfo }) => {
  // 해당 컴포넌트는 토스의 requestPayment()를 통해 결제창으로 리다이렉트 되고난 뒤, 요청 성공 시 돌아온 successUrl로 지정된 컴포넌트입니다.
  // 때문에 상태 관리의 state가 모두 리셋되기 때문에 사용하실 수 없습니다.

  // 따라서, Success.js에서 필요한 값들은 아래와 같은 방법으로 전달할 수 있습니다.
  // way 1. Checkout.js에서 requestPayment() 호출 시, 쿼리 파라미터로 값 전달 (ex: orderName)
  // way 2. Success의 상위 컴포넌트에서 props로 값 전달 (ex: App.js에서 userInfo 전달)
  // way 3. 세션에 저장하여 전달

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchParams] = useSearchParams();

  const orderName = searchParams.get("orderName");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const paymentKey = searchParams.get("paymentKey"); // paymentKey는 토스 SDK에서 발급되는 결제 고유키입니다.

  // TODO: 쿼리 파라미터 값(orderId, amount)이 결제 요청할 때 보낸 데이터와 동일한지 확인 과정이 필요합니다.
  // 클라이언트에서 결제 금액을 조작하는 행위를 방지하기 위함입니다.

  const confirmPayment = async () => {
    const confirmData = {
      orderId: orderId,
      paymentKey: paymentKey,
      amount: amount,
    };
    // 토스의 결제 승인 API를 요청하는 서버 API를 호출합니다.
    const result = await dispatch(postConfirm({ confirmData }));
    const payload = result.payload;

    // 결제 성공/실패 시의 필요 로직을 작성합니다.
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
      // orderId, paymentKey는 토스의 결제 조회 및 취소 API를 호출할 때 필요하므로 반드시 서버에 저장합니다.
      orderId: orderId,
      paymentKey: paymentKey,
      customerKey: userInfo.customerKey,
      orderName: orderName,
      amount: amount,
      payYN: payYN,
    };

    // 최종 결제 결과를 서버에 등록합니다.
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
