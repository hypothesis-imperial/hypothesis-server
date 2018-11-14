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
