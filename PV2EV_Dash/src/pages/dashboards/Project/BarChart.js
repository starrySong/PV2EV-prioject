// @flow
import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Bar, withResponsiveness } from 'britecharts-react';

const ResponsiveBarChart = withResponsiveness(Bar);

// simple bar chart
const BarChart = (props) => {
    const chartContainerStyle = {
        width: '100%',
        height: '300px',
    };

    const barChartData = [
        { name: '10', value: props.ten},
        { name: '11', value: props.eleven },
        { name: '12', value: props.twelve },
        { name: '13', value: props.thirteen },
        { name: '14', value: props.fourteen },
        { name: '15', value: props.fifteen },
        { name: '16', value: props.sixteen },
        { name: '17', value: props.seventeen },
        { name: '18', value: props.eighteen },
        { name: '19', value: props.nineteen },
        { name: '20', value: props.twenty },
        { name: '21', value: props.twentyOne },
        { name: '22', value: props.twentyTwo },
    ];

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mb-4">Bar Chart</h4>
                <div className="bar-container" style={chartContainerStyle}>
                    <ResponsiveBarChart
                        isAnimated={false}
                        data={barChartData}
                        isHorizontal={false}
                        height={300}
                        betweenBarsPadding={0.5}
                        colorSchema={['#39afd1']}
                        margin={{ top: 10, left: 55, bottom: 20, right: 10 }}
                    />
                </div>
            </CardBody>
        </Card>
    );
};

export default BarChart;