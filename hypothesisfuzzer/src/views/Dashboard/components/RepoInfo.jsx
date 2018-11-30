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
import Pass from './Pass';

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
    const n = this.props.repo.fail.length

    const outputTabs = this.props.repo.fail.map((variables, index) => {
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

    const outputs =  this.props.repo.fail.map((variables, index) => {
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
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === n.toString() })}
              onClick={() => { this.toggle(n.toString()); }}
            >
              Passed
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {outputs}
          <TabPane tabId={n.toString()}>
            <Pass pass={this.props.repo.pass}/>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default RepoInfo
