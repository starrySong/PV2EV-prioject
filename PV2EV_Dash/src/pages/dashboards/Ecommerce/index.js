import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./Home";


class EcommerceDashboard extends Component {
	render() {
		return (
			<div className="App">
				<Home></Home>
			</div>
		);
	}
}

export default EcommerceDashboard;
