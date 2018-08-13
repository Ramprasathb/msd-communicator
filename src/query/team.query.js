import gql from 'graphql-tag';

export const getAllTeamsQuery = gql`
  {
    ownedTeams {
      id
      name
      channels {
        id
        name
      }
    }
    memberOfTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;
