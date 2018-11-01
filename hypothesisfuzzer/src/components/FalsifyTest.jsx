import React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap';

const FalsifyTest = (props) => {
  return (
    <div>
      <Card>
        <CardTitle>Test Name: {props.testName}</CardTitle>
        <Variable />
      </Card>
    </div>
  );
};


const Variable = (props) => {
  return (
    <div>
      <CardText>Variable Name: {props.variableName}</CardText>
      <CardText>Variable Value: {props.variableValue}</CardText>
    </div>
  );
};

export default FalsifyTest;
