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
    res => next({ ...rest, data: res.data, type: SUCCESS }),
    err => next({ ...rest, err, type: FAILURE }),
  ).catch((err) => {
    next({ ...rest, err, type: FAILURE });
  });
  return actionPromise;
};
