import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import data from './dummy/dummy.json';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
       data2: data
    }
  }

  render() {

    // var __template = require('./templates/dashboard.template');

    //var data = require('./dummy/dummy.json');
    // var item = data.map((case) =>
    //   <li>{case}</li>
    // );

    var test = JSON.stringify(this.state.data2);

    console.log(data);

    const render = (

       <div className="App">
         <header className="App-header">
           <img src={logo} className="App-logo" alt="logo" />
           <p>
             {test}
           </p>
           <ul>
            <li>test1</li>
           </ul>
         </header>
       </div>
    )

    return render;
  }
}

export default App;
