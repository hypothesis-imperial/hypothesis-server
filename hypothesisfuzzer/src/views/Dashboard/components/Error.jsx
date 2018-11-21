import React, { Component } from 'react';
import {
  Table,
} from 'reactstrap';

class Error extends Component {

  render() {
    const variableList = this.props.variables.map((variables, index) => {
      return (
        <tr>
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
    );
  }
}

export default Error
