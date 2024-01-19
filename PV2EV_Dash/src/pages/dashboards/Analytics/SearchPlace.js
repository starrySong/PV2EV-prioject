import React, { useState } from "react";
import { Row, Col } from 'reactstrap';

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
          <Col>
          <form className="inputForm" onSubmit={handleSubmit}>
            <input
              placeholder="Search Place..."
              onChange={onChange}
              value={inputText}
            />
            <button type="submit">검색</button>
          </form>
          <MapContainer searchPlace={place} />
          </Col>
        </Row>
      </div>
  );
};

export default SearchPlace;