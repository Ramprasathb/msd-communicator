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
    loading, ownedTeams, memberOfTeams, error,
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
      <ChannelHeader channelName="Dummy Text" />
      <DmViewContainer teamId={teamId} userId={userId} />
      <MessageInput
        onSubmit={
          async (message) => {
            const response = await mutate(
              {
                variables: {
                  message,
                  receiverId: userId,
                  teamId,
                },
              },
            );
            console.log(response);
          }
        }
        placeholder={userId}
      />
    </MsdGridLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $message: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, message: $message, teamId: $teamId)
  }
`;

export default compose(
  graphql(getAllTeamsQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
