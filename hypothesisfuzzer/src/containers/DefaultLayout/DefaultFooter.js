import React, { Component } from 'react';


class DefaultFooter extends Component {
  render() {
    return (
      <React.Fragment>
        <span><strong>start time: </strong>{this.props.stats.start_time}</span>
        <span className="ml-auto"><strong>uptime: </strong>{this.props.stats.uptime}</span>
      </React.Fragment>
    );
  }
}


export default DefaultFooter;
