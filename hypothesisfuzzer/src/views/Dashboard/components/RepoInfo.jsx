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
import Fail from './Fail';
import Pass from './Pass';

class RepoInfo extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '0',
    };
  }

  componentWillReceiveProps(newprops) {
    var n = '1';
    if(newprops.repo.fail.length !== 0) {
      n = '0';
    }
    //if there is no failing test, show passes test page
    this.setState({ activeTab: n });
  }

  toggle(tab) {
    if(this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  failtest_tabs() {
    if(this.props.repo.fail.length !== 0) {
      return(
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '0' })}
            onClick={() => { this.toggle('0'); }}
          >
            Failed Tests
          </NavLink>
        </NavItem>
      );
    }
  }

  passtest_tabs() {
    if(this.props.repo.pass.length !== 0) {
      return(
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '1' })}
            onClick={() => { this.toggle('1'); }}
          >
            Passed Tests
          </NavLink>
        </NavItem>
      );
    }
  }

  failtest_tabpane() {
    if(this.props.repo.fail.length !== 0) {
      return(
        <TabPane tabId={'0'}>
          <Fail tests={this.props.repo.fail}/>
        </TabPane>
      );
    }
  }

  passtest_tabpane() {
    if(this.props.repo.pass.length !== 0) {
      return(
        <TabPane tabId={'1'}>
          <Pass tests={this.props.repo.pass}/>
        </TabPane>
      );
    }
  }

  render() {
    return (
      <div>
        <Nav tabs>
          {this.failtest_tabs()}
          {this.passtest_tabs()}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.failtest_tabpane()}
          {this.passtest_tabpane()}
        </TabContent>
      </div>
    );
  }
}

export default RepoInfo
