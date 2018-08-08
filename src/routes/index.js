import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './landing';
import RegisterUser from './registerUser';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/register" exact component={RegisterUser} />
    </Switch>
  </BrowserRouter>
);
