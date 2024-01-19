// flow
import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';




// billing info
const BillingInfo = () => {
    return (
        <React.Fragment>
            <ul className="list-unstyled mb-0">
                <li>
                    <p className="mb-2">
                        <span className="font-weight-bold mr-2">타입:</span> 벽부착형
                    </p>
                    <p className="mb-2">
                        <span className="font-weight-bold mr-2">전격용량:</span>7 kW
                    </p>
                    <p className="mb-2">
                        <span className="font-weight-bold mr-2">제품크기:</span>350(W)×274.5(H)×750(D)mm
                    </p>
                    <p className="mb-2">
                        <span className="font-weight-bold mr-2">충전케이블:</span>케이블일체형(C타입) or 케이블 분리형(B타입,소켓타입)
                    </p>
                    <p className="mb-2">
                        <span className="font-weight-bold mr-2">제품재질:</span>Steel재질
                    </p>
                    <p className="mb-2">
                        <span className="font-weight-bold mr-2">참고:</span>7인치 LCD Display(or LED 상태 표시), RF Card 및 비밀번호 인식, 국내외 모든 전기차 충전가능
                    </p>
                </li>
            </ul>
        </React.Fragment>
    );
};

// delivery info


// order details
const OrderDetails1 = () => {
    return (
        <React.Fragment>
            <div>
                <Card>
                    <CardBody>
                        <h4 className="header-title mb-3">JEV-AW-107</h4>
                        <BillingInfo />
                    </CardBody>
                </Card>
            </div>
        </React.Fragment>
    );
};

export default OrderDetails1;
