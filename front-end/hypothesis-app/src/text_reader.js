import React, { Component } from 'react';

class TextReader extends Component {

	constructor(props) {
		super(props);

		this.state = {
			text: "",
			variables: "",
			value: "",
			error_type: "",
			error_name: "",
			traceback: "",
		};
	}

	componentDidMount() {
		this.readTextContent(this.props.txt);
	}

	readTextContent = file => {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status == 0) {
					var text = rawFile.responseText;
					var content = JSON.parse(text);
					this.setState({
						text: text,
						variables: JSON.stringify(content.Variables[0]['Variable name']),
						value: JSON.stringify(content.Variables[0]['variable value']),
						error_type: JSON.stringify(content['Error type']),
						error_name: JSON.stringify(content['Error name']),
						traceback: JSON.stringify(content.Traceback),
					});
				}
			}
		};
		rawFile.send(null);
	};

	render() {
		return (
			<div>
				<ul>
					<li>Variable name: {this.state.variables}</li>
					<li>Variable value: {this.state.value}</li>
					<li>Error type: {this.state.error_type}</li>
					<li>
						<p>Error name: </p>
						<p>{this.state.error_name}</p>
					</li>
					<li>
						<p>Traceback: </p>
						<p>{this.state.traceback}</p>
					</li>
				</ul>
			</div>
		);
	}
}

export default TextReader;
