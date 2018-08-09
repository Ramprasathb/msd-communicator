import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import 'semantic-ui-css/semantic.min.css';

import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';

const link = createHttpLink({
  uri: 'http://localhost:8071/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      token: localStorage.getItem('token') || null,
      refreshToken: localStorage.getItem('refreshToken') || null,
    },
  });
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;
    if (headers) {
      const token = headers.get('token');
      if (token) {
        localStorage.setItem('token', token);
      }
      const refreshToken = headers.get('refreshToken');
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    return response;
  });
});

const client = new ApolloClient({
  link: concat(authMiddleware, link),
  cache: new InMemoryCache(),
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
