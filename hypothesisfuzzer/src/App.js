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
    },
  }

  fetch_data() {
    const url = "http://ec2-3-8-87-226.eu-west-2.compute.amazonaws.com/all_info";
    fetch(url)
    .then(result => result.json())
    .then(data => {
      this.setState({
        repos: data.repositories,
        stats: {
          start_time: data.start_time,
          uptime: data.uptime,
        }
      })
    }).catch(e => console.log('error:', e));
  }

  componentDidMount() {
    this.fetch_data();
    this.interval = setInterval(() => this.fetch_data(), 30*1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const repos = this.state.repos;
    const stats = this.state.stats;

    //wait until data been fetched
    if(repos.length === 0) {
      return null;
    }

    return (
      <HashRouter>
        <Route path="/" render={() => <DefaultLayout repos={repos} stats={stats} isAuthed={true} /> }/>
      </HashRouter>
    );
  }
}

export default App;
