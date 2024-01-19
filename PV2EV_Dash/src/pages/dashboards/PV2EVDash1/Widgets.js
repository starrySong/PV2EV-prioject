// @flow
import React, {useEffect, useState} from 'react';
import {
    Row,
    Col,
} from 'reactstrap';

import StatisticsWidget from '../../../components/StatisticsWidget'


const Widgets = (props) => {

    const [peckTime, setPeckTime] = useState(0)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const getPost = function (){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalEVParked: props.totalEVParked})
        };
        fetch('http://127.0.0.1:5000/widget', requestOptions)
            .then((response) => { // 서버 요청에 대한 응답받는 코드
                response.json().then(function(data) {
                console.log(data);
                const Info = data[0]['endTime'] == 0? '피크시간 없음': Math.floor(data[0]['endTime']/100) + '시'+ data[0]['endTime']%100 + '분까지';
                setEndTime(Info);// type = Object로 들고온다.
                const temp = data[0]['startTime']/100;
                setStartTime(temp.toFixed(0) + '시'+ data[0]['startTime']%100 + '분 부터');
                setPeckTime(data[0]['duration']+'분간'); // 피크시간이 지속되는 시간(분)
            })
        })
    }
    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        getPost()
        setInterval(()=>{
            getPost()
            },1000*60*15)
    },[]); // 계속 실행되어야할 것 같아서 []파라미터 안씀

    return (
        <React.Fragment>
            {/* StatisticsWidget */}
            <Row>
                <Col>
                    <StatisticsWidget
                        icon="mdi mdi-account-multiple"
                        description="Number of Customers"
                        title="쇼핑피크시간"
                        stats={endTime}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: peckTime,
                            time: startTime,
                        }}></StatisticsWidget>
                </Col>
            </Row>

        </React.Fragment>
    );
};

export default Widgets;