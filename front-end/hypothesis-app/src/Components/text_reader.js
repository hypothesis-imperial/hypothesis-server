import React, { Component } from 'react';

class TextReader extends Component {

	constructor(props) {
		super(props);

		this.state = {
			text: "",
			name: "",
			value: "",
			error_type: "",
			error_name: "",
			traceback: "",
			variables: [],
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
					//console.log(rawFile);
					var text = rawFile.responseText;
					var content = JSON.parse(text);
					this.setState({
						text: text,
						name: JSON.stringify(content.Variables[0]['Variable name']),
						value: JSON.stringify(content.Variables[0]['variable value']),
						error_type: JSON.stringify(content['Error type']),
						error_name: JSON.stringify(content['Error name']),
						traceback: JSON.stringify(content.Traceback),
						variables: content.Variables,
					});
				}
			}
		};
		rawFile.send(null);
	};

	listVariables() {
		//console.log(JSON.stringify(this.state.variables));
		var vars = this.state.variables;
		var varsNo = vars.length;
		//console.log(varsNo);
		for (var i = 0; i < varsNo; i++) {
			//alert(vars[i]);
			var varName = JSON.stringify(vars[i]['Variable name']);
			var varVal = JSON.stringify(vars[i]['variable value']);
			return (
				<div>
					<li>Variable name: {varName}</li>
					<li>Variable value: {varVal}</li>
				</div>
			)
		}
	}

	render() {
		return (
			<div>
				<ul>
					{this.listVariables()}
				</ul>
			</div>
		);
	}
}

export default TextReader;
