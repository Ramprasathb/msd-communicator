import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment, Form, Button } from 'semantic-ui-react';
import Moment from 'react-moment';

import { Messages } from '../msd.directives';
import AddReplyToMessage from '../../modal/addReplyToMessage';

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!, $senderId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId, senderId: $senderId) {
      id
      message
      sender {
        username
      }
      created_at
      reply {
        id
        message
        sender {
          username
        }
        created_at
      }
    }
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class DirectMessageContainer extends React.Component {
  constructor() {
    super();
    this.state = { isAddReplyModalOpen: false, replyActiveMessageId: -1 };
  }

  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
  }

  componentWillReceiveProps({ teamId, userId }) {
    if (this.props.teamId !== teamId || this.props.userId !== userId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      // this.setState({ isAddReplyModalOpen: false });
      this.unsubscribe = this.subscribe(teamId, userId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setReplyActiveMessage = (messageId) => {
    this.setState({ replyActiveMessageId: messageId });
  }

  toggleAddReplyModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({
      isAddReplyModalOpen: !state.isAddReplyModalOpen,
    }));
  }

  openReplyModal = (messageId, username) => {
    this.setState({ messageIdSent: messageId, usernameSent: username, isAddReplyModalOpen: true });
  };

  subscribe = (teamId, userId) => this.props.data.subscribeToMore({
    document: newDirectMessageSubscription,
    variables: {
      teamId,
      userId,
    },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) {
        return prev;
      }

      return {
        ...prev,
        getDirectMessages: [
          ...prev.getDirectMessages,
          subscriptionData.data.newDirectMessage,
        ],
      };
    },
  });

  render() {
    const {
      data: { loading, getDirectMessages }, mutate, userId,
    } = this.props;

    const {
      replyActiveMessageId, isAddReplyModalOpen, usernameSent, messageIdSent, 
    } = this.state;

    return loading ? null : (
      <div>
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
                    <Comment.Action>
                        Reply
                    </Comment.Action>
                  </Comment.Actions>
                  {/* <Form reply={false}>
                    <Form.Input />
                    <Button
                      size="mini"
                      content="Add Reply"
                      labelPosition="left"
                      icon="edit"
                      primary
                    />
                  </Form> */}
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>
        </Messages>
        <AddReplyToMessage
          onClose={this.state.toggleAddReplyModal}
          open={isAddReplyModalOpen}
          username={usernameSent}
          messageId={messageIdSent}
          key="add-reply-modal"
          onSubmit={
            async (messageId, message) => {
              await mutate(
                {
                  variables: {
                    message,
                    messageId,
                  },
                  update: (store) => {
                    console.log(store);
                  },
                },
              );
            }
          }
        />
      </div>
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
  options: props => ({
    variables: {
      teamId: props.teamId,
      userId: props.userId,
    },
    fetchPolicy: 'network-only',
  }),
})(DirectMessageContainer);
