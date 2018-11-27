import React, { Component } from 'react';
import classnames from 'classnames';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
 } from 'reactstrap'
import './../../../css/RepoInfo.css';
import Output from './Output';

class RepoInfo extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '0',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const outputTabs = this.props.repo.outputs.map((variables, index) => {
      if(typeof variables.test_name !== "undefined") {
        return (
          <NavItem key={index}>
            <NavLink
              className={classnames({ active: this.state.activeTab === index.toString() })}
              onClick={() => { this.toggle(index.toString()); }}
            >
              Output {index}
            </NavLink>
          </NavItem>
        )
      }
    })

    const outputs =  this.props.repo.outputs.map((variables, index) => {
      if(typeof variables.test_name !== "undefined") {
        return (
          <TabPane key={index} tabId={index.toString()}>
            <Output output={variables}/>
          </TabPane>
        )
      }
    })

    return (
      <div>
        <Nav tabs>
          {outputTabs}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {outputs}
        </TabContent>
      </div>
    );
  }
}

export default RepoInfo
