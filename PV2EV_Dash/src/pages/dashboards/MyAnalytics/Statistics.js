// @flow
import React, {useEffect, useState} from 'react';
import { Row, Col } from 'reactstrap';

import StatisticsWidget from '../../../components/StatisticsWidget';

const Statistics = () => {
    const [retio, setRetio] = useState(0)
    const [todayPV, setTodayPV] = useState(0)

    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(0)
        };

        fetch('http://127.0.0.1:5000/value1', requestOptions)
            .then((response) => {
                response.json().then(function(data) {
                    setTodayPV(data[0])
                    setRetio(data[1])
                // json형식 데이터에 접근할 때는 forEach를 사용한다.
            })
        })

    }, []);




    function percent(x){
        const results = String(x) + " %";
        return (results);
    }

    function redGreen(x){
        if (x > 0){
            return ('text-success');
        }
        else{
            return ('text-danger');
        }
    }
    function upDown(x){
        if (x > 0){
            return ('mdi mdi-arrow-up-bold');
        }
        else{
            return ('mdi mdi-arrow-down-bold');
        }
    }
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <StatisticsWidget
                        icon="mdi mdi-pulse"
                        description="Growth"
                        title="총 발전량 (kW)"
                        stats= {todayPV}
                        trend={{
                            textClass: redGreen(retio),
                            icon: upDown(retio),
                            value: percent(retio),
                            time: 'Since yesterday',
                        }}>
                    </StatisticsWidget>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Statistics;
