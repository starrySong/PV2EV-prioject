import React, { useState } from "react";
import { Row, Col,Form ,Input,InputGroup,InputGroupAddon, InputGroupText,Button } from 'reactstrap';

import MapContainer from "./MapContainer";

const SearchPlace = () => {
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };

  return (
      <div>
        <Row>
          <Col lg={4}>
                <Form className="inputForm" onSubmit={handleSubmit}>
                    <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                        <InputGroupText >
                            위치검색
                            </InputGroupText>
                        </InputGroupAddon>
                      <Input
                        placeholder="Search Place..."
                        onChange={onChange}
                        value={inputText}
                      />
                      <Button type="submit">검색</Button>
                    </InputGroup>
                </Form>

          </Col>
        </Row>
          <Row>
              <Col>
                  <br />
                <MapContainer searchPlace={place} />
              </Col>
          </Row>
      </div>
  );
};

export default SearchPlace;