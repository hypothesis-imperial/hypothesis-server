import React, { Component } from 'react';
import './App.css';
import result from './dummy/dummy.json';
import axios from 'axios';
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

    var test = JSON.stringify(this.state.data2);


    const render = (

       <div className="App">
         <header className="App-header">
           <TextReader
		         txt={data}
	         />
         </header>
       </div>
    )

    return render;
  }
}

export default App;
