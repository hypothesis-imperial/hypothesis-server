import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
// Containers
import { DefaultLayout } from './containers';
import './App.scss';
import '@coreui/coreui';


class App extends Component {

  render() {
    return (
      <HashRouter>
        <Route path="/" component={DefaultLayout} />
      </HashRouter>
      // <div className="App">
      //   <FalsifyTest test_name={test_name} errors={errors} />
      // </div>
    );
  }
}

export default App;
