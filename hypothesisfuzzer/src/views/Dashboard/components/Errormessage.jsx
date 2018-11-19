import React, { Component } from 'react';
import {
  Table,
} from 'reactstrap';

class Errormessage extends Component {

  render() {
    return (
      <Table hover responsive>
        <tbody style={{ backgroundColor: "#f0f3f5" }}>
          <tr>
            <th>error message</th>
            <td>{this.props.error_message.toString()}</td>
          </tr>
          <tr>
            <th>error type</th>
            <td>{this.props.error_type.toString()}</td>
          </tr>
          <tr>
            <th>traceback</th>
            <td>{this.props.traceback.split('\n').map(function(item, key) {
                return (
                  <span key={key}>
                    {item}
                    <br/>
                  </span>
                )
              })}
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default Errormessage
