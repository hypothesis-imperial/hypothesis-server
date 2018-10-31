import React, { Component } from 'react';
import './App.css';
import result from './dummy/dummy.json';
import TextReader from './Components/text_reader.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: result
    }
  }

  render() {

    var data = require('./dummy/data.txt');

    const render = (
       <div className="App">
         <header className="App-header">
         </header>
         <div className="Container">
           <TextReader
             txt={data}
           />
         </div>
       </div>

    )

    return render;

  }

}

export default App;
