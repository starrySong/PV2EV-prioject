// @flow
import React, {useEffect, useState} from 'react';
import { Card, CardBody, Table } from 'reactstrap';

const BasicTable = (props) => {
    const [records,setRecord] = useState([])
    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalEVParked: props.totalEVParked})
        };
        fetch('http://127.0.0.1:5000/parkedcount', requestOptions)
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
                <h4 className="header-title">주차장 현황</h4>

                <Table className="mb-0">
                    <tbody>
                        {records.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{record.topic}</th>
                                    <td>{record.num + '대'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const ParkedCountTables = (props) => {
    return (
        <React.Fragment>
            <BasicTable totalEVParked = {props.totalEVParked}/>
        </React.Fragment>
    );
};

export default ParkedCountTables;