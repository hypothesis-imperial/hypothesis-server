import React, { Component } from 'react';
import './App.css';
import result from './dummy/dummy.json';
import TextReader from './Components/text_reader.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //data1: data,
      data2: result
    }
  }

  render() {

    var data = require('./dummy/data.txt');

    const render = (
       <div className="App">
         <TextReader
	         txt={data}
         />
       </div>
    )

    return render;
  }
}

export default App;
