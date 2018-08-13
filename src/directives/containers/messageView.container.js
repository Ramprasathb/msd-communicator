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
      text
      created_at
    }
  }
`;

class MessageViewContainer extends React.Component {
  // componentWillMount() {
  // this.unsubscribe = this.subscribe(this.props.channelId);
  // }

  // componentWillReceiveProps({ channelId }) {
  //   if (this.props.channelId !== channelId) {
  //     if (this.unsubscribe) {
  //       this.unsubscribe();
  //     }
  //     this.unsubscribe = this.subscribe(channelId);
  //   }
  // }

  // componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }

  subscribe = () => {
    // this.props.data.subscribeToMore({
    //   document: newChannelMessageSubscription,
    //   variables: {
    //     channelId,
    //   },
    //   updateQuery: (prev, { subscriptionData }) => {
    //     if (!subscriptionData) {
    //       return prev;
    //     }

    //     return {
    //       ...prev,
    //       messages: [...prev.messages, subscriptionData.newChannelMessage],
    //     };
    //   },
    //   onError: err => console.log(err),
    // })
    console.log('subscribe');
    return false;
  };

  render() {
    const {
      data: { loading, getMessages },
    } = this.props;
    console.log(this.props.data);
    return loading ? null : (
      <Messages>
        <Comment.Group>
          {getMessages.map(m => (
            <Comment key={`${m.id}-message`}>
              <Comment.Content>
                <Comment.Author as="a">{m.user.username}</Comment.Author>
                <Comment.Metadata>
                  <Moment fromNow>{m.created_at}</Moment>
                </Comment.Metadata>
                <Comment.Text>{m.message}</Comment.Text>
                {/* <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions> */}
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    );
  }
}

const getMessagesQuery = gql`
  query($channelId: Int!) {
    getMessages(channelId: $channelId) {
      id
      message
      user {
        id
        username
        email
      }
      created_at
    }
  }
`;

export default graphql(getMessagesQuery, {
  options: props => ({
    variables: { channelId: props.channelId },
    fetchPolicy: 'network-only',
  }),
})(MessageViewContainer);
