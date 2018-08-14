import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import gql from 'graphql-tag';

import { MsdGridLayout, ChannelHeader } from '../directives/msd.directives';
import MessageInput from '../directives/messageInput.directive';
import TeamChannelContainer from '../directives/containers/teamChannel.container';
import DmViewContainer from '../directives/containers/dmView.container';

import { getAllTeamsQuery } from '../query/team.query';

const DirectMessages = ({
  mutate, data: {
    loading, ownedTeams, memberOfTeams, error, getUser,
  },
  match: {
    params: { teamId, userId },
  },
}) => {
  if (loading) return null;
  if (error) {
    return (
      <Redirect to="/login" />
    );
  }
  const userOwnerTeams = cloneDeep(ownedTeams);
  userOwnerTeams.forEach((team) => {
    // eslint-disable-next-line no-param-reassign
    team.isOwned = true;
  });

  const allTeams = [...userOwnerTeams, ...memberOfTeams];

  if (allTeams.length < 1) {
    return <Redirect to="/createTeam" />;
  }

  let currentTeamId = teamId;
  if (currentTeamId == null) {
    // If no current team, assign the first team as open
    currentTeamId = allTeams[0].id;
  }
  let currentTeamIndex = findIndex(allTeams, [
    'id',
    parseInt(currentTeamId, 10),
  ]);
  if (currentTeamIndex === -1) currentTeamIndex = 0;
  const currentTeamObj = allTeams[currentTeamIndex];

  return (
    <MsdGridLayout>
      <TeamChannelContainer
        teams={allTeams}
        currentTeam={currentTeamObj}
      />
      <ChannelHeader channelName={getUser.username} />
      <DmViewContainer teamId={teamId} userId={userId} />
      <MessageInput
        onSubmit={
          async (message) => {
            await mutate(
              {
                variables: {
                  message,
                  receiverId: userId,
                  teamId,
                },
                update: (store) => {
                  const data = store.readQuery({ query: getAllTeamsQuery });
                  let updatedTeamIndex = -1;
                  if (data.ownedTeams) {
                    updatedTeamIndex = findIndex(data.ownedTeams, [
                      'id',
                      parseInt(teamId, 10),
                    ]);
                    if (updatedTeamIndex > -1) {
                      const dmUserNotPresent = data.ownedTeams[updatedTeamIndex].directMessageMembers.every(member => member.id !== parseInt(userId, 10));
                      if (dmUserNotPresent) {
                        data.ownedTeams[updatedTeamIndex].directMessageMembers.push({
                          __typename: 'User',
                          id: userId,
                          username: getUser.username,
                        });
                        store.writeQuery({ query: getAllTeamsQuery, data });
                      }
                    }
                  } else {
                    updatedTeamIndex = findIndex(data.memberOfTeams, [
                      'id',
                      parseInt(teamId, 10),
                    ]);
                    if (updatedTeamIndex > -1) {
                      const dmUserNotPresent = data.memberOfTeams[updatedTeamIndex].directMessageMembers.every(member => member.id !== parseInt(userId, 10));
                      if (dmUserNotPresent) {
                        data.memberOfTeams[updatedTeamIndex].directMessageMembers.push({
                          __typename: 'User',
                          id: userId,
                          username: getUser.username,
                        });
                        store.writeQuery({ query: getAllTeamsQuery, data });
                      }
                    }
                  }
                },
              },
            );
          }
        }
        placeholder={getUser.username}
      />
    </MsdGridLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $message: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, message: $message, teamId: $teamId)
  }
`;

const directMessageQuery = gql`
query($userId: Int!){
  getUser(userId: $userId) {
    username
  }
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

export default compose(
  graphql(directMessageQuery, {
    options: props => ({
      variables: { userId: props.match.params.userId },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
