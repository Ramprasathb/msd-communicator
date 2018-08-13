import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import gql from 'graphql-tag';

import {
  MsdGridLayout,
  ChannelHeader,
} from '../directives/msd.directives';
import MessageInput from '../directives/messageInput.directive';
import TeamChannelContainer from '../directives/containers/teamChannel.container';
import MessageViewContainer from '../directives/containers/messageView.container';
import { getAllTeamsQuery } from '../query/team.query';

const CommunicatorHome = ({
  mutate, data: {
    loading, ownedTeams, memberOfTeams, error,
  },
  match: {
    params: { teamId, channelId },
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
  // Identify current team details.
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

  // Identify current channel details
  let currentChannelId = channelId;
  if (channelId == null) {
    if (!currentTeamObj.channels) {
      currentChannelId = currentTeamObj.channels[0].id;
    }
  }
  let currentChannelIndex = findIndex(currentTeamObj.channels, [
    'id',
    parseInt(currentChannelId, 10),
  ]);
  if (currentChannelIndex === -1) currentChannelIndex = 0;
  const currentChannelObj = currentTeamObj.channels[currentChannelIndex];

  return (
    <MsdGridLayout>
      <TeamChannelContainer teams={allTeams} currentTeam={currentTeamObj} />
      {currentChannelObj ? (
        <ChannelHeader channelName={currentChannelObj.name} />
      ) : null }
      {currentChannelObj ? (
        <MessageViewContainer channelId={currentChannelObj.id} />) : null}
      {currentChannelObj ? (
        <MessageInput
          placeholder={currentChannelObj.name}
          onSubmit={async (message) => {
            await mutate({ variables: { message, channelId: currentChannelObj.id } });
          }}
        />
      ) : null}
    </MsdGridLayout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: Int!, $message: String!) {
    createChannelMessage(channelId: $channelId, message: $message)
  }
`;

export default compose(
  graphql(getAllTeamsQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createMessageMutation),
)(CommunicatorHome);
