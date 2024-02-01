import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import CommonCSS from "../css/common.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  postRequest,
  setAmount,
  setOrderId,
  setOrderName,
} from "../features/PaymentSlice";

const clientKey = process.env.CLIENT_KEY;

const Checkout = ({ setCheckoutModal }) => {
  const paymentMethodsWidgetRef = useRef(null);
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.payment);
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log("payment 객체 " + JSON.stringify(payment));

  const [paymentWidget, setPaymentWidget] = useState(null);

  useEffect(() => {
    // 주문 당(Checkout 컴포넌트가 발생될 때마다) 새로운 orderId 생성
    dispatch(setOrderId(nanoid()));
    // [임시] orderName과 amount는 사용자가 선택한 항목에 따라 변경되어야 함
    dispatch(setOrderName("근로소득 원천징수 영수증 외 1건"));
    dispatch(setAmount(5500));
  }, []);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          clientKey,
          userInfo.customerKey
        );
        // const loadedWidget = await loadPaymentWidget(clientKey, ANONYMOUS); // 비회원 결제 시
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: payment.amount },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, payment.amount]);

  const handlePaymentRequest = async () => {
    const data = {
      orderId: payment.orderId,
      customerKey: userInfo.customerKey,
      orderName: payment.orderName,
      amount: payment.amount,
    };

    // 사용자가 결제 요청 시, 로그 등록용 API 호출
    dispatch(postRequest({ data }));

    try {
      await paymentWidget?.requestPayment({
        orderId: payment.orderId,
        orderName: payment.orderName,
        // 현재 사용자 정보 조회 후 입력
        customerName: "김월급",
        customerEmail: "payday@gmail.com",
        customerMobilePhone: "01012341234",
        successUrl: `${window.location.origin}/success?orderName=${payment.orderName}`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  return (
    <div
      className={CommonCSS.paymentModal}
      onClick={() => setCheckoutModal(false)}
    >
      <div
        className={CommonCSS.paymentModalInner}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 결제 UI, 이용약관 UI 영역 */}
        <div id="payment-widget" />
        <div id="agreement" />
        <button onClick={handlePaymentRequest}>결제하기</button>
      </div>
    </div>
  );
};

export default Checkout;
