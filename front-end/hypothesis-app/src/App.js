import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    var __template = require('./templates/dashboard.template');
    // var template = { __html: __html };

    const render = (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            Hello
          </p>
        </header>
      </div>
    )

    return __template;
  }
}

export default App;
