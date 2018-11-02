import React, { Component } from 'react';
import FalsifyTest from './components/FalsifyTest';
import './App.css';
import example from './example/example.json';
import { Card, CardTitle, CardText } from 'reactstrap';

class App extends Component {
  state = {
    falsifyTestCase: {
      test_name: "",
      errors: []
    }
  };

  componentDidMount() {
    //this.setState({falsifyTestCase: example});
    const url = "http://ec2-18-130-116-158.eu-west-2.compute.amazonaws.com/get_errors";
    fetch(url)
    .then(result => result.json())
    .then(result => {
      console.log(result)
      this.setState({falsifyTestCase: result})
    });
  }


  render() {
    const { test_name, errors } = this.state.falsifyTestCase;
    return (
      <div className="App">
        <FalsifyTest test_name={test_name} errors={errors} />
      </div>
    );
  }
}

export default App;
