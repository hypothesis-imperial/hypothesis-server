import React, { Component } from 'react';
import FalsifyTest from './components/FalsifyTest';
import './App.css';

class App extends Component {
  state = {
    falsifyTestCase: {
      testName: "testName",
      errors: []
    }
  };

  componentDidMount() {
      const url = "http://ec2-18-130-116-158.eu-west-2.compute.amazonaws.com/get_errors";
      fetch(url)
      .then(result => result.json())
      .then(result => {this.setState({falsifyTestCase: result})});
  }


  render() {
    const { testName, errors } = this.state.falsifyTestCase;
    return (
      <div className="App">
        <FalsifyTest testName={testName} errors={errors} />
      </div>
    );
  }
}

export default App;
