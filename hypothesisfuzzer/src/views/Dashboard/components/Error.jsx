import React, { Component } from 'react';
import {
  Table,
  Card,
  CardBody,
  CardHeader,
  Collapse,
} from 'reactstrap';
import Errormessage from './Errormessage';

class Error extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: false,
      arrow_icon: "icon-arrow-down",
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    this.setState({ arrow_icon: ((this.state.collapse)? "icon-arrow-down" : "icon-arrow-up")});
  }

  componentWillReceiveProps(nextProps){
    // fold collapse when change to new page
    this.setState({ collapse: false });
  }

  render() {
    const variableList = this.props.error.variables.map((variables, index) => {
      return (
        <tr key={index}>
          <td>
            <div>{variables.v_name}</div>
            <div className="small text-muted">
              <span>New</span> | some details
            </div>
          </td>
          <td className="text-center">
            <div>{variables.v_value}</div>
          </td>
        </tr>
      )
    })

    return (
      <Card>
        <CardHeader className="cardheader-danger" >
          Error {this.props.index}
          <div className="card-header-actions">
            <a className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className={this.state.arrow_icon}></i></a>
          </div>
        </CardHeader>
        <CardBody>
          <Table hover responsive>
            <thead>
            <tr>
              <th>Variable Name</th>
              <th className="text-center">Value</th>
            </tr>
            </thead>
            <tbody>
              {variableList}
            </tbody>
          </Table>
        </CardBody>
        <Collapse isOpen={this.state.collapse} id="collapseExample">
          <CardBody >
            <Errormessage
              error_message={this.props.error.error_message}
              error_type={this.props.error.error_type}
              traceback={this.props.error.traceback}
            />
          </CardBody>
        </Collapse>
      </Card>
    );
  }
}

export default Error
