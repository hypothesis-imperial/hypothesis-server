import React, { Component } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  CardFooter,
  CardHeader,
 } from 'reactstrap'

 class Pass extends Component {
   render() {
     const tests = this.props.pass.map((variables, index) => {
       return(
         <Card key={index}>
           <CardHeader className="cardheader-success" >
             {variables.test_name}
           </CardHeader>
           <CardBody>
             {variables.note}
           </CardBody>
         </Card>
       )
     })

     return (
       <div>
          {tests}
       </div>
     );
   }

 }

 export default Pass
