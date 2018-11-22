import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import RepoInfo from './components/RepoInfo';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [
        {
          errors: [
            {
              error_message: "",
              error_type: "",
              traceback: "",
              variables: [],
            }
          ],
          test_name: "",
          repo_name: "",
        }
      ],
    }
  }

  componentWillMount(props) {
    if(this.props.repos !== []) {
      this.setState({repos: this.props.repos});
    }
  }

  render() {
    const repo
      = this.state.repos[this.props.match.params.id];

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <RepoInfo repo={repo}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
