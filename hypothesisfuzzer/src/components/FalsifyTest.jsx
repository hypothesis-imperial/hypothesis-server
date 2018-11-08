import React from 'react'
import { Card, CardTitle, CardBody, CardDeck, CardHeader, Container, Row, Col } from 'reactstrap'
import './FalsifyTest.css'

const FalsifyTest = (props) => {
  const errorList = props.errors.map((variables, index) => {
    return (
      <Card>
        <CardBody>
          <CardHeader>Error {index}</CardHeader>
          <Error key={index} variables={variables} />
        </CardBody>
      </Card>
    )
  })
  return (
    <Card>
      <CardBody>
        <CardTitle>Test Name: {props.test_name}</CardTitle>
        <CardDeck>
          {errorList}
        </CardDeck>
      </CardBody>
    </Card>
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
