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
    if(this.props.repos.length !== 0) {
      this.setState({repos: this.props.repos});
    }
  }

  render() {
    //exclude incorrect index
    const id = this.props.match.params.id;
    const index = (this.state.repos.length <= id) ? 0 : id;
    const repo = this.state.repos[index];

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
