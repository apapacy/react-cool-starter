/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

import HomePage from '../Home';
import UserInfoPage from '../UserInfo';
import NotFoundPage from '../NotFound';


import config from '../../config';
// Import your global styles here
import '../../theme/normalize.css';
import styles from './styles.scss';

console.log(styles);

export default () => (
  <div className={styles.App}>
    <Helmet {...config.app} />
    <div className={styles.header}>
      <img src={require('./assets/logo.svg')} alt="Logo" role="presentation" />
      <h1>{config.app.title}</h1>
    </div>
    <hr />
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/UserInfo/:id" component={UserInfoPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);
