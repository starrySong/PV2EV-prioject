// @flow
import React, {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple bar chart
const BarChart = (props) => {

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

    const [evten,setEvTen] = useState(0);
    const [eveleven, setEvEleven] = useState(0);
    const [evtwelev, setEvTwelve] = useState(0);
    const [evthirteen, setEvThirteen] = useState(0);
    const [evfourteen, setEvFourteen] = useState(0);
    const [evfifteen, setEvFifteen] = useState(0);
    const [evsixteen, setEvSixteen] = useState(0);
    const [evseventeen, setEvSeventeen] = useState(0);
    const [eveighteen, setEvEighteen] = useState(0);
    const [evnineteen, setEvNineteen] = useState(0);
    const [evtwenty, setEvTwenty] = useState(0);
    const [evtwentyOne, setEvTwentyOne] = useState(0);

    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pvArea: props.pvArea})
        };
        fetch('http://127.0.0.1:5000/generategraph', requestOptions)
            .then((response) => { // 서버 요청에 대한 응답받는 코드
                response.json().then(function(data) {
                console.log(data);
                setTen(data[1][10].toFixed(2));
                setEleven(data[1][11].toFixed(2));
                setTwelve(data[1][12].toFixed(2));
                setThirteen(data[1][13].toFixed(2));
                setFourteen(data[1][14].toFixed(2));
                setFifteen(data[1][15].toFixed(2));
                setSixteen(data[1][16].toFixed(2));
                setSeventeen(data[1][17].toFixed(2));
                setEighteen(data[1][18].toFixed(2));
                setNineteen(data[1][19].toFixed(2));
                setTwenty(data[1][20].toFixed(2));
                setTwentyOne(data[1][21].toFixed(2));
                // 시간별 소모량 받기
                setEvTen(data[0][10].toFixed(2));
                setEvEleven(data[0][11].toFixed(2));
                setEvTwelve(data[0][12].toFixed(2));
                setEvThirteen(data[0][13].toFixed(2));
                setEvFourteen(data[0][14].toFixed(2));
                setEvFifteen(data[0][15].toFixed(2));
                setEvSixteen(data[0][16].toFixed(2));
                setEvSeventeen(data[0][17].toFixed(2));
                setEvEighteen(data[0][18].toFixed(2));
                setEvNineteen(data[0][19].toFixed(2));
                setEvTwenty(data[0][20].toFixed(2));
                setEvTwentyOne(data[0][21].toFixed(2));
            })
        })
    },[]); // 계속 실행되어야할 것 같아서 []파라미터 안씀
    const apexBarChartOpts = {
        chart: {
            height: 380,
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff'],
            },
        },
        colors: ['#fa5c7c', '#6c757d'],
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
        },

        xaxis: {
            categories: [10, 11 ,12 ,13 ,14 ,15 ,16 ,17 ,18 ,19 ,20 ,21],
        },
        legend: {
            offsetY: -10,
        },
        states: {
            hover: {
                filter: 'none',
            },
        },
        grid: {
            borderColor: '#f1f3fa',
        },
    };

    const apexBarChartData = [
        {
            name: 'PV 발전량',
            data: [ten ,eleven, twelev, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen , twenty, twentyOne],
        },
        {
            name: 'EV 전력 소모량',
            data: [evten ,eveleven, evtwelev, evthirteen, evfourteen, evfifteen, evsixteen, evseventeen, eveighteen, evnineteen , evtwenty, evtwentyOne],
        },
    ];

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mb-3">발전량 소모량 비교</h4>
                <Chart options={apexBarChartOpts} series={apexBarChartData} type="bar" className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default BarChart;