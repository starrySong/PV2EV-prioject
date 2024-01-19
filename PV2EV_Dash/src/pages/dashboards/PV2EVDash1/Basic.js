// @flow
import React, {useState,useEffect} from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';

const StripedRowsTable = (props) => {

    const [records,setRecord] = useState([])

    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalEVParked: props.totalEVParked})
        };
        fetch('http://127.0.0.1:5000/table', requestOptions)
            .then((response) => { // 서버 요청에 대한 응답받는 코드
                response.json().then(function(data) {
                console.log(data);
                const Info = data; // type = Object로 들고온다.
                setRecord(Info)
                console.log(records);
            })
        })
    },[]); // 계속 실행되어야할 것 같아서 []파라미터 안씀

    return (
        <Card>
            <CardBody>
                <h4 className="header-title">주차된 EV 정보</h4>
                <p className="text-muted font-14 mb-4">
                </p>

                <Table className="mb-0" striped>
                    <thead>
                        <tr>
                            <th>도착시간</th>
                            <th>배터리 용량</th>
                            <th>초기 배터리 용량</th>
                            <th>남은 배터리 용량</th>
                            <th> 80%까지 남은 충전시간(분)</th>
                            <th>차종</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td>{Math.floor(record.arriveTime/100)}시 {record.arriveTime%100}분</td>
                                    <td>{record.capacity}</td>
                                    <td>{record.currentCapacity}</td>
                                    <td>{record.remainderCapa}</td>
                                    <td>{record.remainderTime}</td>
                                    <td>{record.species}<br/>
                                    <img width = "100px" src={ record.species == '현대코나' ? require('./image/현대코나.png') :
                                    record.species == 'BMWi3' ? require('./image/BMWi3.png') :
                                    record.species == '기아니로' ? require('./image/기아니로.png') :
                                    record.species == '기아레이' ? require('./image/기아레이.png') :
                                    record.species == '기아봉고3' ? require('./image/기아봉고3.png') :
                                    record.species == '기아쏘울' ? require('./image/기아쏘울.png') :
                                    record.species == '닛산리프' ? require('./image/닛산리프.png') :
                                    record.species == '르노삼성SM3ZE' ? require('./image/르노삼성SM3ZE.png') :
                                    record.species == '쉐보레볼트' ? require('./image/쉐보레볼트.png') :
                                    record.species == '현대아이오닉5' ? require('./image/현대아이오닉5.png') :
                                    record.species == '현대포터' ? require('./image/현대포터.png') :
                                    record.species == '현대아이오닉' ? require('./image/현대아이오닉.png') :''} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const Tables = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <StripedRowsTable totalEVParked = {props.totalEVParked}/>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Tables;