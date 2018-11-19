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

  componentDidMount(props) {
    if(this.props.repos != []) {
      this.setState({repos: this.props.repos});
    }
  }


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
