/*global kakao*/
import React, { useEffect, useCallback, useState } from 'react'
import BarChart from './BarChart'
import axios from 'axios'
const Location=()=>{

    const [inputs, setInputs] = useState({
      tempDate: '1/10/2017', 	//사용할 문자열들을 저장하는 객체 형태로 관리!
      tempPlace: '세종시폐기물매립장태양광',
    });

    //그리고 나중에 쓰기 편하게 비구조화 할당!
    const { tempDate, tempPlace } = inputs;

    const onChange = e => {
        const {name, value} = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });

   }//onChange함수

   /*useEffect(()=>{
       axios.post('http://127.0.0.1:5000/value',{
           tempPlace: tempPlace,
           tempDate: tempDate
       }).then((res)=>{
           console.log(res.data)
       })
   })*/

    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tempPlace: tempPlace,
            tempDate: tempDate})
        };
        fetch('http://127.0.0.1:5000/value', requestOptions)
            .then((response) => {
                response.json().then(function(data) {
                console.log(data);
                const getPVData = data; // type = Object로 들고온다.
                console.log(typeof (getPVData));
                console.log("Got Data : " + data.key);
                // json형식 데이터에 접근할 때는 forEach를 사용한다.
            })
        })
    }, []);

    const onReset = () => {
      setInputs({
        tempDate: '',
        tempPlace: '',
      });
    };

    return (
        <div>
        <div>
            <br/>
           <form>
               찾는 곳의 위치를 입력해주세요.<br/>
               <input placeholder = "원하는 데이터 입력"  name="tempPlace" onChange={onChange}/>
               <br/>날짜<br/>
               <input type = "text" placeholder="2018-01-01형식으로 입력하세요"
                      name="tempDate"
                      onChange={onChange}/>
               <button type="submit" onReset={onReset}>검색</button>
           </form>
        </div>

        <div><p/><BarChart/></div>
        </div>
    )
}

export default Location;