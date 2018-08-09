import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './landing';
import RegisterUser from './registerUser';
import Login from './login';
import CreateTeam from './createTeam';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/register" exact component={RegisterUser} />
      <Route path="/login" exact component={Login} />
      <Route path="/createTeam" exact component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);
