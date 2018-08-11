import React from 'react';
import {
  MsdGridLayout,
  ChannelHeader,
  Messages,
  MessageInput,
} from '../directives/msd.directives';
import TeamChannelContainer from '../directives/containers/teamChannel.container';

const CommunicatorHome = ({ match: { params } }) => (
  <MsdGridLayout>
    <TeamChannelContainer teamId={params.teamId} />
    <ChannelHeader channelName="general" />
    <Messages>
      <ul>
        <li />
        <li />
      </ul>
    </Messages>
    <MessageInput>
      <input type="text" placeholder="Type your message here" />
    </MessageInput>
  </MsdGridLayout>
);

export default CommunicatorHome;
