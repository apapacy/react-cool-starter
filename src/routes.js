/* @flow */
import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import App from './containers/App';
import HomePage from './containers/Home';
import UserInfoPage from './containers/UserInfo';
import NotFoundPage from './containers/NotFound';

export default (
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/UserInfo/:id" component={UserInfoPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </App>
  </Router>
);
