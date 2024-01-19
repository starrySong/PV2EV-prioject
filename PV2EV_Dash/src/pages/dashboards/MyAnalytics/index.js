// @flow
import React, {Component} from 'react';

import Properties from "./Properties";
import SearchPlace from './SearchPlace';


class MyAnalyticsDashboardPage extends Component {
    render()
    {
        return (
            <React.Fragment>
                <br/>
                <SearchPlace />
                <br/>
                <Properties />
            </React.Fragment>
        );
    }
}

export default MyAnalyticsDashboardPage;
