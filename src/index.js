import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split, concat } from 'apollo-link';
import 'semantic-ui-css/semantic.min.css';

import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';

const httpLink = createHttpLink({
  uri: 'http://localhost:8071/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8071/subscriptions',
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    },
  },
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

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  concat(authMiddleware, httpLink),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
