/* @flow */
import axios from 'axios';


export const USERS_INVALID = 'USERS_INVALID';
export const USERS_REQUESTING = 'USERS_REQUESTING';
export const USERS_FAILURE = 'USERS_FAILURE';
export const USERS_SUCCESS = 'USERS_SUCCESS';

export const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers0 = (): any => {
  console.log('++++++++++++');
  return {
    promise: client => client.get(API_URL),
    events: [USERS_REQUESTING, USERS_SUCCESS, USERS_FAILURE],
  };
};

export const fetchUsers = (): any => (dispatch) => {
  console.log('fetchUsers');
  dispatch({
    type: USERS_REQUESTING,
  });
  axios.get(API_URL).then(
    value => console.log(value.data) || dispatch({ value, type: USERS_SUCCESS }),
    error => dispatch({ error, type: USERS_FAILURE }),
  );
};

export const fetchUsersIfNeeded = () => fetchUsers();
