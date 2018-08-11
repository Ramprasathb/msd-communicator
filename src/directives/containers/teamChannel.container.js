import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import decode from 'jwt-decode';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import Teams from '../teams.directive';
import Channels from '../channels.directive';
import CreateChannelModal from '../../modal/createChannel';
import { getAllTeamsQuery } from '../../query/team.query';

class TeamChannelContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isAddChannelOpen: false,
    };
  }

  handleCloseCreateChannelModal = () => {
    this.setState({ isAddChannelOpen: false });
  };

  handleOpenCreateChannelModal = () => {
    this.setState({ isAddChannelOpen: true });
  };

  render() {
    const {
      data: { loading, allTeams, error },
      teamId,
    } = this.props;
    if (loading) {
      return null;
    }
    if (error) {
      return (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      );
    }
    // Identify current team details.
    let currentTeamId = teamId;
    if (teamId == null) {
      // If no current team, assign the first team as open
      currentTeamId = allTeams[0].id;
    }
    let currentTeamIndex = findIndex(allTeams, [
      'id',
      parseInt(currentTeamId, 10),
    ]);
    if (currentTeamIndex === -1) currentTeamIndex = 0;
    const currentTeamObj = allTeams[currentTeamIndex];

    // Finding User name from our Token
    let username = '';
    try {
      const authToken = localStorage.getItem('token');
      const { user } = decode(authToken);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
    } catch (err) {
      // Ignore the error and keep username as blank
    }
    return [
      <Teams
        key="team-component"
        teams={allTeams.map(team => ({
          id: team.id,
          name: team.name,
        }))}
      />,
      <Channels
        key="channel-component"
        teamId={currentTeamObj.id}
        teamName={currentTeamObj.name}
        userName={username}
        channels={currentTeamObj.channels}
        users={[{ id: 1, name: 'bot' }, { id: 2, name: 'User1' }]}
        createChannelCallback={this.handleOpenCreateChannelModal}
      />,
      <CreateChannelModal
        onClose={this.handleCloseCreateChannelModal}
        open={this.state.isAddChannelOpen}
        key="addChannel"
        teamId={currentTeamObj.id}
      />,
    ];
  }
}

export default graphql(getAllTeamsQuery)(TeamChannelContainer);
