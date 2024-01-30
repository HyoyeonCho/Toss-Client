import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import CommonCSS from "../css/common.module.css";

// 구매자의 고유 아이디를 불러와 customerKey로 설정
const clientKey = process.env.CLIENT_KEY;
const customerKey = "IiyM24FjYF8aTF8MudjK6"; // 회원가입 시, 설정된 고유 아이디(UUID)

console.log("clientKey: " + clientKey);

const Checkout = ({ setCheckoutModal }) => {
    const [paymentWidget, setPaymentWidget] = useState(null);
    const paymentMethodsWidgetRef = useRef(null);
    const [price, setPrice] = useState(32500);

    useEffect(() => {
        const fetchPaymentWidget = async () => {
            try {
                const loadedWidget = await loadPaymentWidget(clientKey, customerKey);
                // const loadedWidget = await loadPaymentWidget(clientKey, ANONYMOUS); // 비회원 결제 시
                setPaymentWidget(loadedWidget);
            } catch (error) {
                console.error("Error fetching payment widget:", error);
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
            { value: price },
            { variantKey: "DEFAULT" }
        );

        paymentWidget.renderAgreement(
            "#agreement",
            { variantKey: "AGREEMENT" }
        );

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }, [paymentWidget, price]);

    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;

        if (paymentMethodsWidget == null) {
            return;
        }

        paymentMethodsWidget.updateAmount(price);
    }, [price]);

    const handlePaymentRequest = async () => {
        // 결제를 요청하기 전에 orderId, amount를 서버에 저장
        // (결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도)
        try {
            await paymentWidget?.requestPayment({
                orderId: nanoid(), // 주문 당 ID 랜덤 생성
                orderName: "근로소득 원천징수 영수증 외 1건",
                // 현재 사용자 정보 조회 후 입력
                customerName: "김월급",
                customerEmail: "payday@gmail.com",
                customerMobilePhone: "01012341234",
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
            });
        } catch (error) {
            console.error("에러! :", error);
        }
    };

    return (
        <div className={CommonCSS.paymentModal} onClick={() => setCheckoutModal(false)}>
            <div className={CommonCSS.paymentModalInner} onClick={(e) => e.stopPropagation()}>
                {/* 결제 UI, 이용약관 UI 영역 */}
                <div id="payment-widget" />
                <div id="agreement" />
                <button onClick={handlePaymentRequest}>결제하기</button>
            </div>
        </div>
    );
}

export default Checkout;