// @flow
import React, {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple line chart
const LineChart = (props) => {

    const [ten,setTen] = useState(0);
    const [eleven, setEleven] = useState(0);
    const [twelev, setTwelve] = useState(0);
    const [thirteen, setThirteen] = useState(0);
    const [fourteen, setFourteen] = useState(0);
    const [fifteen, setFifteen] = useState(0);
    const [sixteen, setSixteen] = useState(0);
    const [seventeen, setSeventeen] = useState(0);
    const [eighteen, setEighteen] = useState(0);
    const [nineteen, setNineteen] = useState(0);
    const [twenty, setTwenty] = useState(0);
    const [twentyOne, setTwentyOne] = useState(0);
    const [twentyTwo, setTwentyTwo] = useState(0);

    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalEVParked: props.totalEVParked})
        };
        fetch('http://127.0.0.1:5000/lineAnnotation', requestOptions)
            .then((response) => { // 서버 요청에 대한 응답받는 코드
                response.json().then(function(data) {
                console.log(data);
                setTen(data[10]);
                setEleven(data[11]);
                setTwelve(data[12]);
                setThirteen(data[13]);
                setFourteen(data[14]);
                setFifteen(data[15]);
                setSixteen(data[16]);
                setSeventeen(data[17]);
                setEighteen(data[18]);
                setNineteen(data[19]);
                setTwenty(data[20]);
                setTwentyOne(data[21]);
                setTwentyTwo(data[22]);
            })
        })
    },[]); // 계속 실행되어야할 것 같아서 []파라미터 안씀

    const apexLineChartWithLables =
        {

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
            text: 'EV차량 수',
            align: 'left',
            style: {
                fontSize: '14px',
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
            categories: ['10', '11', '12', '13', '14', '15', '16','17','18','19','20','21'],
            title: {
                text: 'Hour',
            },
        },
        yaxis: {
            title: {
                text: 'Count',
            },
            min: 0,
            max: 60,
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
            name: '차량 수',
            data: [ten ,eleven, twelev, thirteen, fourteen, fifteen, sixteen, seventeen,eighteen,nineteen,twenty, twentyOne,0],
        },
    ];

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mb-3">시간별 EV차량 수</h4>
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
