/* @flow */

import path from 'path';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import chalk from 'chalk';
import { trigger } from 'redial';

import createHistory from 'history/createMemoryHistory';
import configureStore from './redux/store';
import Html from './utils/Html';
import App from './containers/App';
import { port, host } from './config';

const app = express();

// Using helmet to secure Express with various HTTP headers
app.use(helmet());
// Prevent HTTP parameter pollution.
app.use(hpp());
// Compress all requests
app.use(compression());

// Use morgan for http request debug (only show error)
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }));
app.use(favicon(path.join(process.cwd(), './build/public/favicon.ico')));
app.use(express.static(path.join(process.cwd(), './build/public')));

// Run express as webpack dev server
if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../tools/webpack/webpack.client.babel');

  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    noInfo: true,
    stats: 'errors-only',
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

// Register server-side rendering middleware
app.get('*', (req, res) => {
  if (__DEV__) webpackIsomorphicTools.refresh();

  const history = createHistory();
  const store = configureStore(history);
  const { dispatch, getState } = store;

  const renderHtml = (store, htmlContent) => {  // eslint-disable-line no-shadow
    const html = renderToStaticMarkup(<Html store={store} htmlContent={htmlContent} />);

    return `<!doctype html>${html}`;
  };

  // If __DISABLE_SSR__ = true, disable server side rendering
  if (__DISABLE_SSR__) {
    res.send(renderHtml(store));
    return;
  }
  const routerContext = { dispatch };
  const component = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={routerContext} history={history}>
        <App />
      </StaticRouter>
    </Provider>);

  trigger('fetch', component, routerContext).then(
    () => {
      console.log('*************************************');
      const state = getState();
      const htmlContent = renderToString(component, state);
      res.status(200).send(renderHtml(store, htmlContent));
    },
  ).then(
    () => console.log('999999999999999999999999'),
  );

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response
  if (routerContext.url) {
    res.status(301).setHeader('Location', routerContext.url);
    res.end();

    // return;
  }

  // Checking is page is 404
  // const status = routerContext.status === '404' ? 404 : 200;

  // Pass the route and initial state into html template
});

if (port) {
  app.listen(port, host, (err) => {
    if (err) console.error(`==> 😭  OMG!!! ${err}`);

    console.info(chalk.green(`==> 🌎  Listening at http://${host}:${port}`));
    // Open Chrome
    // require('../tools/openBrowser').default(port);
  });
} else {
  console.error(chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified'));
}
