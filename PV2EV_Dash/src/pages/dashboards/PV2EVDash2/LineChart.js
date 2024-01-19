// @flow
import React, {useState, useEffect} from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple line chart
const LineChart = () => {
    const [totalEVParked,setTotalEVParked] = useState(0);

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

    const [preten,setPreTen] = useState(0);
    const [preeleven, setPreEleven] = useState(0);
    const [pretwelev, setPreTwelve] = useState(0);
    const [prethirteen, setPreThirteen] = useState(0);
    const [prefourteen, setPreFourteen] = useState(0);
    const [prefifteen, setPreFifteen] = useState(0);
    const [presixteen, setPreSixteen] = useState(0);
    const [preseventeen, setPreSeventeen] = useState(0);
    const [preeighteen, setPreEighteen] = useState(0);
    const [prenineteen, setPreNineteen] = useState(0);
    const [pretwenty, setPreTwenty] = useState(0);
    const [pretwentyOne, setPreTwentyOne] = useState(0);
    const [pretwentyTwo, setPreTwentyTwo] = useState(0);
    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalEVParked: totalEVParked})
        };
        fetch('http://127.0.0.1:5000/serialsales', requestOptions)
            .then((response) => { // 서버 요청에 대한 응답받는 코드
                response.json().then(function(data) {
                console.log(data);
                setTen(data[1][10]);
                setEleven(data[1][11]);
                setTwelve(data[1][12]);
                setThirteen(data[1][13]);
                setFourteen(data[1][14]);
                setFifteen(data[1][15]);
                setSixteen(data[1][16]);
                setSeventeen(data[1][17]);
                setEighteen(data[1][18]);
                setNineteen(data[1][19]);
                setTwenty(data[1][20]);
                setTwentyOne(data[1][21]);
                setTwentyTwo(data[1][22]);

                setPreTen(data[0][10]);
                setPreEleven(data[0][11]);
                setPreTwelve(data[0][12]);
                setPreThirteen(data[0][13]);
                setPreFourteen(data[0][14]);
                setPreFifteen(data[0][15]);
                setPreSixteen(data[0][16]);
                setPreSeventeen(data[0][17]);
                setPreEighteen(data[0][18]);
                setPreNineteen(data[0][19]);
                setPreTwenty(data[0][20]);
                setPreTwentyOne(data[0][21]);
                setPreTwentyTwo(data[0][22]);
            })
        })
    },[]); // 계속 실행되어야할 것 같아서 []파라미터 안씀

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
            text: 'EV주차장 체류시간에 따른 수익비교',
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
                text: 'Temperature',
            },
            min: 400000,
            max: 2500000,
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
            name: '캐노피 주차장 설치 후 기대수익',
            data: [ten ,eleven, twelev, thirteen, fourteen, fifteen, sixteen, seventeen,eighteen,nineteen,twenty, twentyOne,0],
        },
        {
            name: '기존기대수익',
            data: [preten ,preeleven, pretwelev, prethirteen, prefourteen, prefifteen, presixteen, preseventeen, preeighteen, prenineteen, pretwenty, pretwentyOne,0],
        },
    ];

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mb-3"></h4>
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