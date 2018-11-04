import React from 'react'
import { Card, CardTitle, Container, Row, Col } from 'reactstrap'
import './FalsifyTest.css'

const FalsifyTest = (props) => {
  const errorList = props.errors.map((variables, index) => {
    return (
      <div>
        <Card className="Error">
          <CardTitle>Error {index}</CardTitle>
          <Error key={index} variables={variables} />
        </Card>
      </div>
    )
  })
  return (
    <div className="Test">
      <Card>
        <CardTitle className="TestName">Test Name: {props.test_name}</CardTitle>
        {errorList}
      </Card>
    </div>
  )
}

const Error = (props) => {
  const variableList = props.variables.map((variable, index) => {
    return <Variable key={index} v_name={variable.v_name} v_value={variable.v_value} />
  })
  return (
    <div>
      {variableList}
    </div>
  )
}

const Variable = (props) => {
  return (
    <div className="Variable">
      <Container>
        <Row>
          <Col>Variable Name: </Col>
          <Col>{props.v_name}</Col>
        </Row>
        <Row>
          <Col>Variable Value: </Col>
          <Col>{props.v_value}</Col>
        </Row>
      </Container>
    </div>
  )
}

export default FalsifyTest
