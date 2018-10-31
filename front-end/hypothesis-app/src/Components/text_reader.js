import React, { Component } from 'react';
import './text_reader.css';

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
				if (rawFile.status === 200 || rawFile.status === 0) {
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
		console.log(JSON.stringify(this.state.variables));
		var vars = this.state.variables;
		var varsNo = vars.length;
		var i = 0;
		console.log(varsNo);
		return (
			<div>
	      {vars.map(variable => {
	        var varName = JSON.stringify(variable['Variable name']);
	        var varVal = JSON.stringify(variable['variable value']);
	        i++;
	        return (
	          <div className="Test">
	            <span>Test case {i}</span>
	            <table>
	              <tr>
	                <td>Variable name</td>
	                <td>{varName}</td>
	              </tr>
	              <tr>
	                <td>Variable value</td>
	                <td>{varVal}</td>
	              </tr>
	              <tr>
	                <td>Optional field</td>
	                <td>field</td>
	              </tr>
	              <tr>
	                <td>Optional long field</td>
	                <td>lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</td>
	              </tr>
	              <tr>
	                <td>Optional long long long long long long long long long long label</td>
	                <td>lorem ipsum</td>
	              </tr>
	            </table>
	          </div>
	        );
	      })}
			</div>
    );
	}

	render() {
		return (
			<div>
				<h1>Test failures</h1>
				{this.listVariables()}
			</div>
		);
	}
}

export default TextReader;
