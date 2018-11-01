import React from 'react'
import { Card, CardTitle, CardText } from 'reactstrap'

const FalsifyTest = (props) => {
  const errorList = props.errors.map((variables, index) => {
    return <Error key={index} variables={variables} />
  })
  return (
    <div>
      <Card>
        <CardTitle>Test Name: {props.test_name}</CardTitle>
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
    <div>
      <CardText>Variable Name: {props.v_name}</CardText>
      <CardText>Variable Value: {props.v_value}</CardText>
    </div>
  )
}

export default FalsifyTest
