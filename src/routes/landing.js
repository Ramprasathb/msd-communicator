import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

const Home = ({ data: { loading, allUsers } }) => (loading ? null : allUsers.map(u => <h1 key={u.id}>{u.email}</h1>));

export default graphql(allUsersQuery)(Home);
