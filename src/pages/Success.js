import React, {useState} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommonCSS from "../css/common.module.css"

const Success = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터(orderId, amount)와 동일한지 반드시 확인
    // (클라이언트에서 결제 금액을 조작하는 행위를 방지 가능)
    async function confirmPayment() {
        const response = await fetch("http://localhost:8080/toss/confirm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount
            })
        });

        const json = await response.json();

        if (response.ok) {
            // TODO: 결제 완료 비즈니스 로직 구현
            setIsConfirmed(true);
            console.log("결제 성공" + JSON.stringify(json));
        } else {
            // TODO: 결제 실패 비즈니스 로직 구현
            console.log("결제 실패" + JSON.stringify(json));
            navigate(`/fail?message=${json.message}&code=${json.code}`);
            return;
        }

    }

    return (
        <div>
            {isConfirmed ? (
                <div className={CommonCSS.onTheMiddle}>
                    <img src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"/>
                    <h2>결제를 완료했어요!</h2>
                    <div style={{textAlign: "left"}}>
                        <p>결제 금액: <span>{amount}</span></p>
                        <p>주문 번호: <span>{orderId}</span></p>
                        <p>paymentKey: <span>{paymentKey}</span></p>
                    </div>
                </div>
            ) : (
                <div className={CommonCSS.onTheMiddle}>
                    <img src="https://static.toss.im/lotties/loading-spot-apng.png"/>
                    <div style={{textAlign: "center"}}>
                        <h2>결제 요청까지 성공했어요!</h2>
                        <p>결제 승인하고 완료해보세요 :)</p>
                        <button onClick={confirmPayment}>결제 승인하기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Success;