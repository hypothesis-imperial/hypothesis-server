import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppSidebarToggler } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

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

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
