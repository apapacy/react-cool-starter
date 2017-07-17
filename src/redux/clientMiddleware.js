const clientMiddleware = axios =>
  ({ dispatch, getState }) =>
    next => (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, events, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = events;
      next({ ...rest, type: REQUEST });

      const actionPromise = promise(axios);
      console.log('in promise');
      actionPromise.then(
        res => console.log(res.data) || next({ ...rest, data: res.data, type: SUCCESS }),
        err => console.log(err) || next({ ...rest, err, type: FAILURE }),
      ).catch((err) => {
        console.error('MIDDLEWARE ERROR:', err);
        next({ ...rest, err, type: FAILURE });
      });

      return actionPromise;
    };

export default clientMiddleware;
