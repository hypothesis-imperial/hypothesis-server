import React, { Component } from 'react';

class Variable extends Component {
  render() {
    return (
      <tr>
        <td>
          <div>{this.props.v_name}</div>
          <div className="small text-muted">
            <span>New</span> | some details
          </div>
        </td>
        <td className="text-center">
          <div>{this.props.v_value}</div>
        </td>
      </tr>
    );
  }
}

export default Variable
