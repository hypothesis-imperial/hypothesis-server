import React, { Component } from 'react';
import { AppSidebarToggler } from '@coreui/react';


class DefaultHeader extends Component {
  render() {
    return (
      <div>
        <React.Fragment>
          <AppSidebarToggler className="d-lg-none" display="md" mobile />
          <AppSidebarToggler className="d-md-down-none" display="lg" />
            Hypothesis
        </React.Fragment>
      </div>
    );
  }
}

export default DefaultHeader;
