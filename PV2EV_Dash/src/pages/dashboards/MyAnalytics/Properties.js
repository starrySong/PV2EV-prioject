import React, {useState, useEffect} from "react";
import { Row, Col,FormGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText,Button } from 'reactstrap';
import LineChart from "./LineChart";
import BarChart from "./BarChart";

const Properties =()=>{
    const [pvdata0, setPvdata0] = useState(0)
    const [pvdata1, setPvdata1] = useState(0)
    const [pvdata2, setPvdata2] = useState(0)
    const [pvdata3, setPvdata3] = useState(0)
    const [pvdata4, setPvdata4] = useState(0)
    const [pvdata5, setPvdata5] = useState(0)
    const [pvdata6, setPvdata6] = useState(0)
    const [pvdata7, setPvdata7] = useState(0)
    const [pvdata8, setPvdata8] = useState(0)
    const [pvdata9, setPvdata9] = useState(0)
    const [pvdata10, setPvdata10] = useState(0)
    const [pvdata11, setPvdata11] = useState(0)
    const [pvdata12, setPvdata12] = useState(0)
    const [pvdata13, setPvdata13] = useState(0)
    const [pvdata14, setPvdata14] = useState(0)
    const [pvdata15, setPvdata15] = useState(0)
    const [pvdata16, setPvdata16] = useState(0)
    const [pvdata17, setPvdata17] = useState(0)
    const [pvdata18, setPvdata18] = useState(0)
    const [pvdata19, setPvdata19] = useState(0)
    const [pvdata20, setPvdata20] = useState(0)
    const [pvdata21, setPvdata21] = useState(0)
    const [pvdata22, setPvdata22] = useState(0)
    const [pvdata23, setPvdata23] = useState(0)
    const [jan,setJan]=useState(0)
    const [feb,setFeb]=useState(0)
    const [mar,setMar]=useState(0)
    const [apr,setApr]=useState(0)
    const [may,setMay]=useState(0)
    const [jun,setJun]=useState(0)
    const [jul,setJul]=useState(0)
    const [aug,setAug]=useState(0)
    const [sep,setSep]=useState(0)
    const [oct,setOct]=useState(0)
    const [nov,setNov]=useState(0)
    const [dec,setDec]=useState(0)

    const [af,setAf] = useState(0)
    const [inputs, setInputs] = useState({
        area: '',
        tilt: '',
        azimuth:''
    });
    const { area, tilt, azimuth } = inputs;

    const onChange = (e) => {
        const { name, value }  = e.target;
        setInputs({
        ...inputs,
        [name]: value,
        });
    };

    const onReset = (e) => {
        e.preventDefault()
        const resetInputs ={
             area: '',
            tilt: '',
            azimuth:''
        }
        setInputs(resetInputs)
      };
    const fsad = (e) =>{
        e.preventDefault()
        if(af === 1){
            setAf(0)
        }
        else{
            setAf(1)
        }
    }
    useEffect(()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({area:inputs.area, tilt:inputs.tilt, azimuth: inputs.azimuth} )
        };
        fetch('http://127.0.0.1:5000/param', requestOptions)
            .then((response) => {
                response.json().then(function(data) {
                    setPvdata0(data[0])
                    setPvdata1(data[1])
                    setPvdata2(data[2])
                    setPvdata3(data[3])
                    setPvdata4(data[4])
                    setPvdata5(data[5])
                    setPvdata6(data[6])
                    setPvdata7(data[7])
                    setPvdata8(data[8])
                    setPvdata9(data[9])
                    setPvdata10(data[10])
                    setPvdata11(data[11])
                    setPvdata12(data[12])
                    setPvdata13(data[13])
                    setPvdata14(data[14])
                    setPvdata15(data[15])
                    setPvdata16(data[16])
                    setPvdata17(data[17])
                    setPvdata18(data[18])
                    setPvdata19(data[19])
                    setPvdata20(data[20])
                    setPvdata21(data[21])
                    setPvdata22(data[22])
                    setPvdata23(data[23])
                // json형식 데이터에 접근할 때는 forEach를 사용한다.
            })
        })
        fetch('http://127.0.0.1:5000/param/month', requestOptions)
            .then((response) => {
                response.json().then(function(data) {
                    setJan(data[0])
                    setFeb(data[1])
                    setMar(data[2])
                    setApr(data[3])
                    setMay(data[4])
                    setJun(data[5])
                    setJul(data[6])
                    setAug(data[7])
                    setSep(data[8])
                    setOct(data[9])
                    setNov(data[10])
                    setDec(data[11])

                    console.log(data)
                // json형식 데이터에 접근할 때는 forEach를 사용한다.
            })
        })
    },[af])
    return(
        <div>
        <Row>
        <Col>
            <div id='three-input'>
                <p>
                    <FormGroup>
                        <Form>
                            <InputGroup>
                                <InputGroupAddon addonType='prepend'>
                                    <InputGroupText >
                                        넓이
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input name="area"
                                       placeholder="넓이를 입력하세요"
                                       onChange={onChange}
                                       value={area}
                                       type="text"
                                       id="text"
                                />
                                 <InputGroupAddon addonType='prepend'>
                                    <InputGroupText >
                                        경사각
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input name="tilt"
                                       placeholder="경사각을 입력하세요"
                                       onChange={onChange}
                                       value={tilt}
                                />
                                 <InputGroupAddon addonType='prepend'>
                                    <InputGroupText >
                                        방위각
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input name="azimuth"
                                       placeholder="방위각을 입력하세요"
                                       onChange={onChange}
                                       value={azimuth}
                                />
                                <Button onClick={fsad}>검색</Button>&nbsp;
                                <Button onClick={onReset}>params 추가</Button>
                            </InputGroup>

                        </Form>
                    </FormGroup>
                </p>
            </div>

        </Col>
        </Row>
        <Row>
            <Col>
                <LineChart title = {'시간별'}
                           zero = {pvdata0} one = {pvdata1} two = {pvdata2} three = {pvdata3} four = {pvdata4} five = {pvdata5}
                           six = {pvdata6} seven = {pvdata7} eight = {pvdata8} nine = {pvdata9} ten = {pvdata10} eleven = {pvdata11} twelve = {pvdata12}
                           thirteen = {pvdata13} fourteen = {pvdata14} fifteen = {pvdata15} sixteen = {pvdata16} seventeen = {pvdata17} eighteen = {pvdata18} nineteen = {pvdata19}
                           twenty = {pvdata20} twentyOne = {pvdata21} twentyTwo = {pvdata22} twentyTree = {pvdata23}
                />
            </Col>
        </Row>
            <Row>
                <Col>
                    <BarChart jan={jan} feb={feb} mar={mar} apr={apr} may={may} jun={jun} jul={jul} aug={aug} sep={sep} oct={oct}
                        nov={nov} dec={dec}
                    />
                </Col>
            </Row>
    </div>

    );
}
export default Properties