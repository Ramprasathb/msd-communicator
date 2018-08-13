import React from 'react';
import styled from 'styled-components';
import { Header, Input } from 'semantic-ui-react';

// Start of Grid Layout
const MsdGridLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 100px 250px 1fr;
  grid-template-rows: auto 1fr auto;
`;
// End of Grid Layout

const ChannelHeaderComponent = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

const ChannelHeader = ({ channelName }) => (
  <ChannelHeaderComponent>
    <Header textAlign="center">
      #&nbsp;
      {channelName}
    </Header>
  </ChannelHeaderComponent>
);

const Messages = styled.div`
  padding: 10px;
  grid-column: 3;
  grid-row: 2;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
`;

const MessageInputComponent = styled.div`
  grid-column: 3;
  grid-row: 3;
`;

const MessageInput = () => (
  <MessageInputComponent>
    <Input fluid placeholder="Type your message here" />
  </MessageInputComponent>
);

const PullLeft = styled.div`
  padding-left: 10px;
`;

export {
  MsdGridLayout, ChannelHeader, Messages, MessageInput, PullLeft,
};
