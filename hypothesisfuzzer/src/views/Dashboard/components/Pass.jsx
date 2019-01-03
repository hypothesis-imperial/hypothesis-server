import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from 'reactstrap';
import Stats from './Stats';

 class Pass extends Component {
   shownote(note) {
      if(note.length !== 0) {
        return(
          <CardBody>
            <div className="small text-muted">Note: {note}</div>
          </CardBody>
        );
      }
    }

   render() {
     const tests = this.props.tests.map((variables, index) => {
       return(
         <Card key={index}>
           <CardHeader className="cardheader-success" >
             {variables.test_name}
           </CardHeader>
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

 export default Pass
