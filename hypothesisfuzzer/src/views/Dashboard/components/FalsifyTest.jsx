import React from 'react'
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Table,
  Thread,
  CardFooter,
  Progress,
 } from 'reactstrap'
import './FalsifyTest.css'

const FalsifyTest = (props) => {
  const errorList = props.errors.map((variables, index) => {
    return (
      <Card>
        <CardHeader className="cardheader-danger">Error {index}</CardHeader>
        <CardBody>
          <Error key={index} variables={variables} />
        </CardBody>
      </Card>
    )
  })
  return (
    <Card>
      <CardBody>
        <Row>
          <Col sm="5">
            <CardTitle className="mb-0">{props.test_name}</CardTitle>
            <div className="small text-muted">Test Name</div>
          </Col>
        </Row>
        <Row>
          <Col style={{ marginTop: 30 + 'px' }}>
            {errorList}
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
  )
}

const Error = (props) => {
  const variableList = props.variables.map((variable, index) => {
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
  )
}

const Variable = (props) => {
  return (
    <tr>
      <td>
        <div>{props.v_name}</div>
        <div className="small text-muted">
          <span>New</span> | some details
        </div>
      </td>
      <td className="text-center">
        <div>{props.v_value}</div>
      </td>
    </tr>
  )
}

export default FalsifyTest