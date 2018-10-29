import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    var __template = require('./templates/dashboard.template');


    var data = require('./dummy/dummy.json');
    var test = JSON.stringify(data);

    console.log(data);

    const render = (
       <div className="App">
         <header className="App-header">
           <img src={logo} className="App-logo" alt="logo" />
           <p>
             {test}
           </p>
         </header>
       </div>
    )

    return render;
  }
}

export default App;
