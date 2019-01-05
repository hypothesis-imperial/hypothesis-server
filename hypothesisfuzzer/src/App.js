import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
// Containers
import { DefaultLayout } from './containers';
import './scss/App.scss';
import '@coreui/coreui';


class App extends Component {
  state = {
    repos: [],
    stats: {
      start_time: "",
      uptime: "",
    }
  }

  fetch_data() {
    const url = "http://ec2-18-130-116-158.eu-west-2.compute.amazonaws.com/all_info";
    fetch(url)
    .then(result => result.json())
    .then(result => {
      this.setState({
        repos: result.repositories,
        stats: {
          start_time: result.start_time,
          uptime: result.uptime,
        }
      })
    });
  }

  componentDidMount() {
    this.fetch_data();
    this.interval = setInterval(() => this.fetch_data(), 60*1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const repos = this.state.repos;
    const stats = this.state.stats;
    return (
      <HashRouter>
        <Route path="/" render={() => <DefaultLayout repos={repos} stats={stats} isAuthed={true} /> }/>
      </HashRouter>
    );
  }
}

export default App;
