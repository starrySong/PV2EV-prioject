// @flow
import React from 'react';
import { Row, Col } from 'reactstrap';
import Properties from "./Properties";

import SearchPlace from './SearchPlace';


const AnalyticsDashboardPage = () => {
    return (
        <React.Fragment>
            <SearchPlace />
            <Properties />
        </React.Fragment>
    );
};

export default AnalyticsDashboardPage;
