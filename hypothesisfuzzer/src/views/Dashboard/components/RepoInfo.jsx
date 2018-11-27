import React, { Component } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  CardFooter,
 } from 'reactstrap'
import './../../../css/RepoInfo.css';
import Error from './Error';
import Time from './Time';

class RepoInfo extends Component {

  render() {
    return (
      <Card>
        <CardBody>
          <Row>
            <Col sm="5">
              <CardTitle className="mb-0">{this.props.repo.test_name}</CardTitle>
              <div className="small text-muted">Test Name</div>
            </Col>
          </Row>
          <Row>
            <Col style={{ marginTop: 30 + 'px' }}>
              {this.props.repo.errors.map((variables, index) => {
                return (
                  <Error key={index} index={index} error={variables} />
                )
              })}
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Time />
        </CardFooter>
      </Card>
    );
  }
}

export default RepoInfo
