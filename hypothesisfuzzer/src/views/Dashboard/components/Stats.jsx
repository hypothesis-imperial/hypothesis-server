import React, { Component } from 'react';
import {
  Row,
  Col,
  Progress,
 } from 'reactstrap'

class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      failing: this.props.stats.failing_examples,
      invalid: this.props.stats.invalid_examples,
      passing: this.props.stats.passing_examples,
    };
  }

  render() {
    const failing = this.props.stats.failing_examples;
    const invalid = this.props.stats.invalid_examples;
    const passing = this.props.stats.passing_examples;
    const total = failing + invalid + passing;
    const fail_percentage = (failing*100/total).toFixed(2);
    const invalid_percentage = (invalid*100/total).toFixed(2);
    const pass_percentage = (passing*100/total).toFixed(2);

    return (
      <Row className="text-center">
        <Col sm={12} md className="mb-sm-2 mb-0">
          <strong>{failing} Fail ({fail_percentage}%)</strong>
          <Progress className="progress-xs mt-2" color="danger" value={fail_percentage.toString()} />
        </Col>
        <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
          <strong>{invalid} Invalid ({invalid_percentage}%)</strong>
          <Progress className="progress-xs mt-2" color="warning" value={invalid_percentage.toString()} />
        </Col>
        <Col sm={12} md className="mb-sm-2 mb-0">
          <strong>{passing} Pass ({pass_percentage}%)</strong>
          <Progress className="progress-xs mt-2" color="success" value={pass_percentage.toString()} />
        </Col>
      </Row>
    );
  }
}

export default Stats
