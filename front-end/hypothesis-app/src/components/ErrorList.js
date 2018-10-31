import React, { Component } from 'react';
import './ErrorList.css';

class ErrorList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			text: "",
			testName: "",
			errorList: [],
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
						testName: "testExample",
						errorList: content.errors,
					});
				}
			}
		};
		rawFile.send(null);
	};

	listErrors() {
		var errors = this.state.errorList;
		var i = 0;	//counter for errors
		return (
			<div>
				{errors.map(e => {
					i++;
					return (this.listVariables(e, i));
				})}
			</div>
		);
	}

	listVariables(error, i) {
		var varName = "";
		var varVal = "";
		var j = 0;	//counter for variables
		return (
			<div>
				<p>Error {i}</p>
	      {error.map(variable => {
	        varName = JSON.stringify(variable['Variable name']);
	        varVal = JSON.stringify(variable['variable value']);
	        j++;
	        return (
	          <div className="Test">
	            <span>Variable {j}</span>
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
				<h1 style={{ textAlign:'center' }}>Test Name: {this.state.testName}</h1>
				{this.listErrors()}
			</div>
		);
	}
}

export default ErrorList;
