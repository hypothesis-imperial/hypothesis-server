import React from 'react'
import { Card, CardTitle } from 'reactstrap'
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
      <table>
        <tr>
          <td>Variable Name: </td>
          <td>{props.v_name}</td>
        </tr>
        <tr>
          <td>Variable Value: </td>
          <td>{props.v_value}</td>
        </tr>
        <tr>
          <td>Optional field</td>
          <td>field</td>
        </tr>
        <tr>
          <td>Optional long field</td>
          <td>lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</td>
        </tr>
        <tr>
          <td>Optional long long long long long long long long long long label</td>
          <td>lorem ipsum</td>
        </tr>
      </table>
    </div>
  )
}

export default FalsifyTest
