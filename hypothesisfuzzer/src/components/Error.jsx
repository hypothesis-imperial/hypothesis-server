import React from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';


const Variable = (props) => {
  return (
    <div>
      <Card>
        <CardBody>
          <CardText>Variable Name: {props.variableName}</CardText>
          <CardText>Variable Value: {props.variableValue}</CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default Variable;
