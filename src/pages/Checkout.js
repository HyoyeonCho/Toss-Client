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

  const [paymentWidget, setPaymentWidget] = useState(null);

  useEffect(() => {
    // 주문 당 새로운 orderId를 생성합니다.
    dispatch(setOrderId(nanoid()));
    // [임시] orderName과 amount는 사용자가 선택한 항목에 따라 변경되어야합니다.
    dispatch(setOrderName("근로소득 원천징수영수증 외 1건"));
    dispatch(setAmount(5500));
  }, []);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          clientKey,
          userInfo.customerKey
        );
        // 비회원 결제 시, customerKey대신 토스 SDK의 ANONYMOUS를 사용합니다.
        // const loadedWidget = await loadPaymentWidget(clientKey, ANONYMOUS);
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

    const requestData = {
      orderId: payment.orderId,
      customerKey: userInfo.customerKey,
      orderName: payment.orderName,
      amount: payment.amount,
    };

    // 사용자가 결제를 요청할 시, 서버에 로그를 등록합니다. (필수 X)
    dispatch(postRequest({ requestData }));

    try {
      await paymentWidget?.requestPayment({
        orderId: payment.orderId,
        orderName: payment.orderName,
        customerName: userInfo.name,
        customerEmail: userInfo.email,
        customerMobilePhone: userInfo.phone,
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
