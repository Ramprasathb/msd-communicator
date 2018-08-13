import React from 'react';
import styled from 'styled-components';
import { Icon, Divider } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { PullLeft } from './msd.directives';

const ChannelComponent = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
  overflow-y: auto;
`;

const ChannelSectionHeader = styled.div`
  margin-top: 10px;
  color: #fff;
  font-size: 20px;
`;

const ChannelSectionList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 5px;
`;

const ChannelSectionListItem = styled.li`
  padding-left: 10px;
  margin: 2px;
  &:hover {
    background: #3e313c;
  }
`;

const ChannelSectionListHeader = styled.li`
  padding-left: 5px;
`;

const Green = styled.span`
  color: #38978d;
  padding-right: 5px;
`;

// eslint-disable-next-line jsx-a11y/accessible-emoji
const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const constructChannelView = ({ id, name }, teamId) => (
  <Link to={`/${teamId}/${id}`} key={`channel_${id}`}>
    <ChannelSectionListItem>
      <Bubble />
      #&nbsp;
      {name}
    </ChannelSectionListItem>
  </Link>
);

const constructDirectMessagesView = ({ id, username }, teamId) => (
  <Link to={`/user/${teamId}/${id}`} key={`dm_${id}`}>
    <ChannelSectionListItem>
      <Bubble />
      {username}
    </ChannelSectionListItem>
  </Link>
);


const Channels = ({
  teamId,
  teamName,
  isOwnedTeam,
  userName,
  channels,
  users,
  createChannelCallback,
  onInviteUsersClick,
  onDMUsersCallback,
}) => (
  <ChannelComponent>
    <PullLeft>
      <ChannelSectionHeader>{teamName}</ChannelSectionHeader>
        &nbsp;({userName})
      {isOwnedTeam ? (
        <div>
          <a href="#inviteUsers" onClick={onInviteUsersClick}>
            Invite users
          </a>
        </div>
      ) : null}
      <Divider horizontal />
    </PullLeft>
    <div>
      <ChannelSectionList>
        <ChannelSectionListHeader>
          Channels&nbsp;
          {isOwnedTeam ? (
            <Icon name="add circle" onClick={createChannelCallback} />
          ) : null}
        </ChannelSectionListHeader>
        {channels.map(c => constructChannelView(c, teamId))}
      </ChannelSectionList>
    </div>
    <div>
      <ChannelSectionList>
        <ChannelSectionListHeader>
          Direct Messages&nbsp;
          <Icon name="add circle" onClick={onDMUsersCallback} />
        </ChannelSectionListHeader>
        {users.map(u => (
          (u.username !== userName)
            ? constructDirectMessagesView(u, teamId, userName) : null))}
      </ChannelSectionList>
    </div>
  </ChannelComponent>
);

export default Channels;
