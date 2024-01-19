// @flow
import React, {useState} from 'react';
import { Row, Col } from 'reactstrap';
import Widgets from './Widgets';
import LineChart from './LineChart'
import BarChart from "./BarChart";
import SaveCost from './SaveCost'


const PV2EVDash2board = () => {
    const [pvArea, setPvArea] = useState( // totalEVParked => 총 ev 주차 가능한 대수
        localStorage.getItem('pvArea') || '',)

    React.useEffect(() => {
      localStorage.setItem('pvArea', pvArea);
    }, [pvArea]);

    const onChange = (e) => {
            setPvArea(e.target.value)
            console.log(setPvArea);
    }

    return (
        <React.Fragment><br/>
            <Row>
                <Col lg={6}>
                    <Widgets pvArea = {pvArea}/>
                </Col>
                <Col>
                    <SaveCost />
                </Col>
            </Row>
            <Row>
                <Col>
                    <LineChart/>
                </Col>
            </Row>

            <Row>
                <Col>
                    <BarChart pvArea = {pvArea}/>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PV2EVDash2board;