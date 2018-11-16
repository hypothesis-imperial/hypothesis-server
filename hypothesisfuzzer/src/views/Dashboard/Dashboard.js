import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import FalsifyTest from './components/FalsifyTest';
import example from './../../example3.json';

class Dashboard extends Component {
  state = {
    repos: example.repositories,
  }

  componentDidMount() {
    const url = "http://ec2-18-130-116-158.eu-west-2.compute.amazonaws.com/all_info";
    fetch(url)
    .then(result => result.json())
    .then(result => {
      console.log("result", (result.repositories));
      this.setState({repos: result.repositories})
    });
    //const repo = this.state.repos[this.props.match.params.id];
  }

  ComponentWillReceiveProps(nextProps) {
    if (true) {
      const newRepo = this.state.repos[nextProps.match.params.id];
      this.setState({falsifyTestCase: newRepo[0]});
    }
  }

  render() {
    const { errors, test_name }
      = this.state.repos[this.props.match.params.id];
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <FalsifyTest test_name={test_name} errors={errors}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
