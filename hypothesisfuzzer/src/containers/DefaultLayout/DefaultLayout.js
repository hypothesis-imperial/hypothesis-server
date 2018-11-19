import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav,
} from '@coreui/react';
// routes config
import routes from '../../routes';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class DefaultLayout extends Component {
  render() {
    //get repo list
    const repos = this.props.repos;
    var repoNum = 0;
    const repolist = [];

    repos.map(() =>{
      repolist.push(
        {
          name: 'Repo ' + repoNum,
          url: `/dashboard/${repoNum}`,
          icon: 'icon-check',
        }
      );
      repoNum++;
      return repolist;
    });

    //nav for sidebar
    const navigation = {
      items: [
        {
          name: 'Dashboard',
          url: '#',
          icon: 'icon-speedometer',
        },
        {
          title: true,
          name: 'Repositories',
        },
      ].concat(repolist),
    };

    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
          </AppSidebar>
          <main style={{ backgroundColor: "#F6F5F5" }} className="main">
            <Row>
              <Col>
                <AppBreadcrumb appRoutes={routes}/>
              </Col>
            </Row>

            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />)
                      : (null);
                  },
                )}
                <Redirect from="/" to="/homepage" />
              </Switch>
            </Container>
          </main>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
