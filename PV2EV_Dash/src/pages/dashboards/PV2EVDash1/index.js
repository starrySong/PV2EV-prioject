// @flow
import React, {useState} from 'react';
import { Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText,Button } from 'reactstrap';
import Widgets from './Widgets'
import Tables from './Basic'
import LineChart from './LineChart'
import OrderDetails from "./OrderDetails";
import OrderDetails1 from "./OrderDetails1";
import ParkCount from "./ParkCount";

const AnalyticsDashboardPage = () => {

    const [totalEVParked, setTotalEVParked] = useState( // totalEVParked => 총 ev 주차 가능한 대수
        localStorage.getItem('totalEVParked') || '',)

    React.useEffect(() => {
      localStorage.setItem('totalEVParked', totalEVParked);
    }, [totalEVParked]);

    const onChange = (e) => {
            setTotalEVParked(e.target.value)
            console.log(totalEVParked);
    }

    return (
        <React.Fragment>
            <Row>
                <Col lg={6}>
                    <br/>
                    모델 설정
                    <Input type="select" name="select" id="exampleSelect">
                        <option>JC-6511PS-B-PO-BC & JEV-AW-107</option>
                        <option>JC-6511PS-B-PO-BC</option>
                        <option>JEV-AW-107</option>
                    </Input>
                </Col>
            </Row>
            <br />
            <Row>
                <Col lg={6}>
                    <OrderDetails />
                </Col>
                <Col lg={6}>
                    <OrderDetails1 />
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Row>
                        <Col>
                            <Widgets totalEVParked = {totalEVParked}/>
                        </Col>
                    </Row>
                </Col>
                <Col lg={6}>
                    <ParkCount totalEVParked={totalEVParked}/>
                </Col>
            </Row>

            <Row>
                <Col>
                    <LineChart totalEVParked = {totalEVParked}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Tables totalEVParked = {totalEVParked}/>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default AnalyticsDashboardPage;
