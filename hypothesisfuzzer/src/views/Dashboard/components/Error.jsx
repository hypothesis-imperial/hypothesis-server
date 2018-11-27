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
      error: this.props.error,
      index: this.props.index,
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    this.setState({ arrow_icon: ((this.state.collapse)? "icon-arrow-down" : "icon-arrow-up")});
  }

  componentWillReceiveProps(nextProps){
    // fold collapse when change to new page
    this.setState({ collapse: false });
    this.setState({ arrow_icon: "icon-arrow-down"});
    this.setState({ error: nextProps.error });
    this.setState({ index: nextProps.index });
  }

  render() {
    const variableList = this.state.error.variables.map((variables, index) => {
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
          Error {this.state.index}
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
              error_message={this.state.error.error_message}
              error_type={this.state.error.error_type}
              traceback={this.state.error.traceback}
            />
          </CardBody>
        </Collapse>
      </Card>
    );
  }
}

export default Error
