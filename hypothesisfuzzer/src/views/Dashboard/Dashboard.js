import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import FalsifyTest from './components/FalsifyTest';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [
        {
          errors: [],
          test_name: "",
          repo_name: "",
        }
      ],
    }
  }

  componentWillMount(props) {
    const url = "http://ec2-18-130-116-158.eu-west-2.compute.amazonaws.com/all_info";
    fetch(url)
    .then(result => result.json())
    .then(result => {
      this.setState({repos: result.repositories})
    })
  }

  /*not in use now*/
  // ComponentWillReceiveProps(nextProps) {
  //   if (true) {
  //     const newRepo = this.state.repos[nextProps.match.params.id];
  //     this.setState({falsifyTestCase: newRepo[0]});
  //   }
  // }

  render() {
    const { errors, test_name, repo_name }
      = this.state.repos[this.props.match.params.id];

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <FalsifyTest test_name={test_name} errors={errors} repo_name={repo_name}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
