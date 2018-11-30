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
          fail: [],
          pass: [],
          note: [],
          repo_name: "",
        }
      ],
    }
  }

  componentDidMount() {
    this.setState({repos: this.props.repos});
  }

  render() {
    //exclude incorrect index
    const id = this.props.match.params.id;
    const index = (this.state.repos.length <= id) ? 0 : id;
    const repo = this.state.repos[index];

    if(!repo.hasOwnProperty('fail') &&
      !repo.hasOwnProperty('pass')) {
      return(<div>empty</div>);
    } else {
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
}

export default Dashboard;
