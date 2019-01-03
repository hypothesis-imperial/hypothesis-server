import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  CardFooter,
} from 'reactstrap';
import Error from './Error';
import Stats from './Stats';

 class Fail extends Component {
  shownote(note) {
     if(note.length !== 0) {
       return(
         <CardBody>
           <div className="large text-muted">Note: {note}</div>
         </CardBody>
       );
     }
   }

   render() {
     const tests = this.props.tests.map((variables, index) => {
       return(
         <Card key={index}>
           <CardBody>
             <Row>
               <Col sm="5">
                 <CardTitle className="mb-0">{variables.test_name}</CardTitle>
                 <div className="small text-muted">Test Name</div>
               </Col>
             </Row>
             <Row>
               <Col style={{ marginTop: 30 + 'px' }}>
                 {variables.errors.map((variables, index) => {
                   return (
                     <Error key={index} index={index} error={variables} />
                   )
                 })}
               </Col>
             </Row>
           </CardBody>
           {this.shownote(variables.note)}
           <CardFooter>
             <Stats stats={variables.statistics}/>
           </CardFooter>
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

 export default Fail
