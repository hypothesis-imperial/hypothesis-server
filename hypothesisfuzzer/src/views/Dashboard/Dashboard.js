import React, { Component } from 'react';
import {
  Col,
  Row,
  Alert,
} from 'reactstrap';
import RepoInfo from './components/RepoInfo';
import './../../css/Dashboard.css';

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
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({
      repos: this.props.repos,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillReceiveProps(newprops) {
    this.setState({ loading: true });
    this.timer = setTimeout(() => { this.setState({ loading: false }) }, 1000);
  }

  render() {
    //exclude incorrect index
    const id = this.props.match.params.id;
    const index = (this.state.repos.length <= id) ? 0 : id;
    const repo = this.state.repos[index];

    return (
      <div className="animated fadeIn">
        <div>
          <Alert color="info" isOpen={this.state.loading}>
            refetching data...
          </Alert>
        </div>
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
