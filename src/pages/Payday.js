import React, {useState} from "react";
import Checkout from "../pages/Checkout";
import CommonCSS from "../css/common.module.css"
import bong from "../../public/images/봉급이.png"

const Payday = () => {

    const [checkoutModal, setCheckoutModal] = useState(false);

    return (
        <>
            {checkoutModal ? <Checkout setCheckoutModal={setCheckoutModal}/> : null}
            <div className={CommonCSS.paymentBox}>
                <img src={bong} alt="봉급이"/>
                <button onClick={() => setCheckoutModal(true)}>결제하기</button>
            </div>
        </>
    );
};

export default Payday;