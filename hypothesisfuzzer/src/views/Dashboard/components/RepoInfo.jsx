import React, { Component } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  CardFooter,
  Progress,
 } from 'reactstrap'
import './../../../css/RepoInfo.css';
import Error from './Error';

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
          <Row className="text-center">
            <Col sm={12} md className="mb-sm-2 mb-0">
              <div className="text-muted">some</div>
              <strong>29.703 Users (40%)</strong>
              <Progress className="progress-xs mt-2" color="success" value="40" />
            </Col>
            <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
              <div className="text-muted">data</div>
              <strong>24.093 Users (20%)</strong>
              <Progress className="progress-xs mt-2" color="info" value="20" />
            </Col>
            <Col sm={12} md className="mb-sm-2 mb-0">
              <div className="text-muted">be</div>
              <strong>78.706 Views (60%)</strong>
              <Progress className="progress-xs mt-2" color="warning" value="60" />
            </Col>
            <Col sm={12} md className="mb-sm-2 mb-0">
              <div className="text-muted">shown</div>
              <strong>22.123 Users (80%)</strong>
              <Progress className="progress-xs mt-2" color="danger" value="80" />
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  }
}

export default RepoInfo
