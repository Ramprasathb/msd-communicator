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
      directMessageMembers {
        id
        username
      }
    }
    memberOfTeams {
      id
      name
      channels {
        id
        name
      }
      directMessageMembers {
        id
        username
      }
    }
  }
`;
