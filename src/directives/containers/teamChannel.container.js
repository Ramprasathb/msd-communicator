import React from 'react';
import decode from 'jwt-decode';

import Teams from '../teams.directive';
import Channels from '../channels.directive';
import CreateChannelModal from '../../modal/createChannel';
import AddUsersToTeamModal from '../../modal/addUsersToTeam';

class TeamChannelContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isAddChannelOpen: false,
      isInviteUsersModalOpen: false,
    };
  }

  toggleCreateChannelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ isAddChannelOpen: !state.isAddChannelOpen }));
  };

  toggleInviteUsersModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({
      isInviteUsersModalOpen: !state.isInviteUsersModalOpen,
    }));
  };

  render() {
    const { currentTeam, teams } = this.props;
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
        teams={teams.map(tempTeam => ({
          id: tempTeam.id,
          name: tempTeam.name,
        }))}
      />,
      <Channels
        key="channel-component"
        teamId={currentTeam.id}
        teamName={currentTeam.name}
        isOwnedTeam={currentTeam.isOwned}
        userName={username}
        channels={currentTeam.channels}
        users={[{ id: 1, name: 'bot' }, { id: 2, name: 'User1' }]}
        createChannelCallback={this.toggleCreateChannelModal}
        onInviteUsersClick={this.toggleInviteUsersModal}
      />,
      <CreateChannelModal
        onClose={this.toggleCreateChannelModal}
        open={this.state.isAddChannelOpen}
        key="addChannel"
        teamId={currentTeam.id}
      />,
      <AddUsersToTeamModal
        onClose={this.toggleInviteUsersModal}
        open={this.state.isInviteUsersModalOpen}
        key="addUsersToTeam"
        teamId={currentTeam.id}
      />,
    ];
  }
}

export default TeamChannelContainer;
