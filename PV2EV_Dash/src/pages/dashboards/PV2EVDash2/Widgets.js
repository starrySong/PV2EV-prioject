// @flow
import React, {useEffect, useState} from 'react';
import {
    Row,
    Col,
} from 'reactstrap';

import StatisticsWidget from '../../../components/StatisticsWidget';


const Widgets = (props) => {
    const [totalEVParked,setTotalEVParked] = useState(0);
    const [predictSales, setPredictSales] = useState(0);
    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalEVParked: totalEVParked})
        };
        fetch('http://127.0.0.1:5000/predictsales', requestOptions)
            .then((response) => { // 서버 요청에 대한 응답받는 코드
                response.json().then(function(data) {
                console.log(data);
                setPredictSales(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            })
        })
    },[]); // 계속 실행되어야할 것 같아서 []파라미터 안씀

    return (
        <React.Fragment>
            {/* StatisticsWidget */}
            <Row>
                <Col>
                    <StatisticsWidget
                        icon="mdi mdi-account-multiple"
                        description="Number of Customers"
                        title="예상기대수익"
                        stats={predictSales + " 원"}
                        ></StatisticsWidget>
                </Col>
            </Row>

        </React.Fragment>
    );
};

export default Widgets;