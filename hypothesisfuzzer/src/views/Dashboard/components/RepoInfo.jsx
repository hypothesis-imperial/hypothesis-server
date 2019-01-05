import React, { Component } from 'react';
import classnames from 'classnames';
import {
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  CardHeader,
  Table,
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
    if (newprops.repo.hasOwnProperty('fail')) {
      if(newprops.repo.fail.length !== 0) {
        n = '0';
      }
      //if there is no failing test, show passes test page
    }
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

  state_badge(state){
    return( state ? (<Badge color="success">true</Badge>) : (<Badge color="danger">false</Badge>)
      );
  }

  render() {
    const repo = this.props.repo;
    const states = (
      <Card>
        <CardBody>
          <Table responsive striped size="sm">
            <tbody>
            <tr>
              <th>duration</th>
              <td>{repo.duration}</td>
            </tr>
            <tr>
              <th>fuzzing</th>
              <td>{this.state_badge(repo.fuzzing)}</td>
            </tr>
            <tr>
              <th>iterations</th>
              <td>{repo.iterations}</td>
            </tr>
            <tr>
              <th>owner</th>
              <td>{repo.owner}</td>
            </tr>
            <tr>
              <th>ready</th>
              <td>{this.state_badge(repo.ready)}</td>
            </tr>
            <tr>
              <th>start</th>
              <td>{repo.start}</td>
            </tr>
            <tr>
              <th>status</th>
              <td>{repo.status}</td>
            </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );

    if(!repo.hasOwnProperty('fail') &&
      !repo.hasOwnProperty('pass')) {
      return(<div>{states}</div>);
    } else {
      return (
        <div>
          {states}
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
}

export default RepoInfo