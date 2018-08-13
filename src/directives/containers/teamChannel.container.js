import React from 'react';
import decode from 'jwt-decode';

import Teams from '../teams.directive';
import Channels from '../channels.directive';
import CreateChannelModal from '../../modal/createChannel';
import AddUsersToTeamModal from '../../modal/addUsersToTeam';
import DMUsersModal from '../../modal/directMessageUsers';

class TeamChannelContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isAddChannelOpen: false,
      isInviteUsersModalOpen: false,
      isDMUsersModalOpen: false,
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

  toggleDMUsersModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({
      isDMUsersModalOpen: !state.isDMUsersModalOpen,
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
        users={currentTeam.directMessageMembers}
        createChannelCallback={this.toggleCreateChannelModal}
        onInviteUsersClick={this.toggleInviteUsersModal}
        onDMUsersCallback={this.toggleDMUsersModal}
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
      <DMUsersModal
        teamId={currentTeam.id}
        onClose={this.toggleDMUsersModal}
        open={this.state.isDMUsersModalOpen}
        key="invite-people-modal"
      />,
    ];
  }
}

export default TeamChannelContainer;
