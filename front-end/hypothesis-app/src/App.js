import React, { Component } from 'react';
import './App.css';
import result from './dummy/dummy.json';
import ErrorList from './components/ErrorList.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: result
    }
  }

  render() {

    var data = require('./dummy/example.txt');

    const render = (
       <div className="App">
         <header className="App-header">
         </header>
         <div className="Container">
           <ErrorList
             txt={data}
           />
         </div>
       </div>

    )

    return render;

  }

}

export default App;
