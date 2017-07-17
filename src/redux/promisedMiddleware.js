export default fetch => ({ dispatch, getState }) => next => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  const { promise, events, ...rest } = action;
  if (!promise) {
    return next(action);
  }
  const [REQUEST, SUCCESS, FAILURE] = events;
  next({ ...rest, type: REQUEST });
  const actionPromise = promise(fetch);
  actionPromise.then(
    value => next({ ...rest, value, type: SUCCESS }),
    error => next({ ...rest, error, type: FAILURE }),
  ).catch((error) => {
    next({ ...rest, error, type: FAILURE });
  });
  return actionPromise;
};
