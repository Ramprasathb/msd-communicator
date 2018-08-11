import React from 'react';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';

import decode from 'jwt-decode';

import Landing from './landing';
import RegisterUser from './registerUser';
import Login from './login';
import CreateTeam from './createTeam';
import AllTeams from './allTeams';

const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
    return true;
  } catch (err) {
    return false;
  }
};

const AuthenticatedRoute = ({ component: Component, ...args }) => (
  <Route
    {...args}
    render={props => (
      isUserAuthenticated() ? (
        <Component
          {...props}
        />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      ))}
  />
);

export default () => (
  <BrowserRouter>
    <Switch>
      <AuthenticatedRoute path="/landing" exact component={Landing} />
      <Route path="/register" exact component={RegisterUser} />
      <Route path="/login" exact component={Login} />
      <AuthenticatedRoute path="/createTeam" exact component={CreateTeam} />
      <AuthenticatedRoute path="/:teamId?/:channelId?" exact component={AllTeams} />
    </Switch>
  </BrowserRouter>
);