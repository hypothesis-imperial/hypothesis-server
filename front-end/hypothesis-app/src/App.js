import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import result from './dummy/dummy.json';
import axios from 'axios';
import TextReader from './Components/text_reader.js';

class App extends Component {

  getData() {
    axios.get('http://0.0.0.0:80/')
      .then(response => console.log(response))
  }

  constructor(props) {
    super(props);

    this.state = {
      data: result
    }
  }

  render() {

    var data = require('./dummy/data.txt');

    var test = JSON.stringify(this.state.data);

    const render = (

       <div className="App">
         <header className="App-header">
         </header>
         <TextReader
           txt={data}
         />
       </div>

    )

    return render;

  }

}

export default App;
