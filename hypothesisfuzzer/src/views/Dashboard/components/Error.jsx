import React, { Component } from 'react';
import {
  Table,
} from 'reactstrap';
import Variable from './Variable';

class Error extends Component {

  render() {
    const variableList = this.props.variables.map((variable, index) => {
      return <Variable key={index} v_name={variable.v_name} v_value={variable.v_value} />
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
