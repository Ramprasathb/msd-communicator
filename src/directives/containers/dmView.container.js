import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';
import Moment from 'react-moment';

import { Messages } from '../msd.directives';

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      message
      user {
        username
      }
      created_at
    }
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class DirectMessageContainer extends React.Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.userId);
  }

  componentWillReceiveProps({ channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (channelId) => {
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.newChannelMessage],
        };
      },
    });
  };

  render() {
    const {
      data: { loading, getDirectMessages },
    } = this.props;

    return loading ? null : (
      <Messages>
        <Comment.Group>
          {getDirectMessages.map(m => (
            <Comment key={`${m.id}-direct-message`}>
              <Comment.Content>
                <Comment.Author as="a">{m.sender.username}</Comment.Author>
                <Comment.Metadata>
                  <Moment fromNow>{m.created_at}</Moment>
                </Comment.Metadata>
                <Comment.Text>{m.message}</Comment.Text>
                {m.reply.length === 0 ? null : (
                  <Comment.Group>
                    {m.reply.map(r => (
                      <Comment key={`${r.id}-direct-message-reply`}>
                        <Comment.Content>
                          <Comment.Author as="a">
                            {r.sender.username}
                          </Comment.Author>
                          <Comment.Metadata>
                            <Moment fromNow>{r.created_at}</Moment>
                          </Comment.Metadata>
                          <Comment.Text>{r.message}</Comment.Text>
                        </Comment.Content>
                      </Comment>
                    ))}
                  </Comment.Group>
                )}
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    );
  }
}

const directMessagesQuery = gql`
  query($teamId: Int!, $userId: Int!) {
    getDirectMessages(teamId: $teamId, receiverId: $userId) {
      id
      sender {
        username
      }
      message
      created_at
      reply {
        id
        sender {
          username
        }
        message
        created_at
      }
    }
  }
`;

export default graphql(directMessagesQuery, {
  variables: props => ({
    teamId: props.teamId,
    userId: props.userId,
  }),
})(DirectMessageContainer);
