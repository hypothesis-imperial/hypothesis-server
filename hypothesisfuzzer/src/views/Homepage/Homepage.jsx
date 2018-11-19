import React, { Component } from 'react';
import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

class Homepage extends Component {
  render() {
    return (
      <Row>
        <Col>
          <Card className="text-white bg-info text-center">
            <CardBody>Wellcome to Hypothesis! Please select the repository</CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Homepage;
