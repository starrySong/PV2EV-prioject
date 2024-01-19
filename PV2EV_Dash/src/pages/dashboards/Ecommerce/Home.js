import React, { Component } from 'react';
import Map from './Map';

class Home extends Component {

	render() {
		return(
			<div style={{ margin: '100px'}}>
				<Map
					google={this.props.google}
					center={{lat: 37.5398126, lng: 127.0529696}}
					height='300px'
					zoom={15}
				/>
			</div>
		);
	}
}

export default Home;
