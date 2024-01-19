// @flow
import React,{useState,useEffect} from 'react';
import { Row, Col } from 'reactstrap';

const AnalyticsDashboardPage = () => {
    const [suc,setSuc] = useState("wait")
    useEffect(()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({} )
        };
        fetch('http://127.0.0.1:5000/api/pvwatts', requestOptions)
            .then((response) => {
                response.json().then(function(data) {
                    setSuc(data)
                // json형식 데이터에 접근할 때는 forEach를 사용한다.
            })
        })
    },[])
    return (
        <React.Fragment>

            <Row>
                <Col>
                    <h1>
                        {suc}
                    </h1>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default AnalyticsDashboardPage;
