// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple line chart
const LineChart = (props) => {
    const apexLineChartWithLables = {
        chart: {
            height: 380,
            type: 'line',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#727cf5', '#0acf97'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            width: [3, 3],
            curve: 'smooth',
        },
        title: {
            text: 'W',
            align: 'left',
            style: {
                fontSize: '16px',
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
        markers: {
            style: 'inverted',
            size: 6,
        },
        xaxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7',
                '8', '9', '10', '11', '12', '13', '14', '15', '16',
                '17', '18','19','20','21','22','23'
            ],
            title: {
                text: 'Hour',
            },
        },
        yaxis: {
            title: {
                text: 'pv',
            },
            min: 0,
            max: 1200,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5,
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };

    const apexLineChartWithLablesData = [
        {
            name: 'pv 예측',
            data: [props.zero, props.one, props.two, props.three,
                props.four, props.five, props.six, props.seven,
                props.eight, props.nine, props.ten, props.eleven,
                props.twelve, props.thirteen, props.fourteen, props.fifteen,
                props.sixteen, props.seventeen, props.eighteen, props.nineteen, props.twenty,
                props.twentyOne, props.twentyTwo,props.twentyTree
            ],
        },
    ];

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mb-3">{props.title}</h4>
                <Chart
                    options={apexLineChartWithLables}
                    series={apexLineChartWithLablesData}
                    type="line"
                    className="apex-charts"
                />
            </CardBody>
        </Card>
    );
};

export default LineChart;
