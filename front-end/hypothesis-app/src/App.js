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
      //data1: data,
      data2: result
    }
  }

  render() {

    var data = require('./dummy/data.txt');
    //this.readTextFile(file);

    var test = JSON.stringify(this.state.data2);

    //console.log(data);
    //console.log(result);
    //this.getData();

  //   render: function(){
  //   return (
  //     <div>
  //       <ul>
  //         {
  //          this.state.data.map(function(item, i){
  //            console.log('test');
  //            <li>Test</li>
  //          })
  //        }
  //       </ul>
  //     </div>
  //   )
  // }

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
