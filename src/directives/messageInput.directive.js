import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const MessageInputComponent = styled.div`
  grid-column: 3;
  padding: 10px;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <MessageInputComponent>
    <Input
      onKeyDown={(e) => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      name="message"
      value={values.message}
      fluid
      placeholder={`Message #${channelName}`}
    />
  </MessageInputComponent>
);

const createMessageMutation = gql`
  mutation($channelId: Int!, $message: String!) {
    createChannelMessage(channelId: $channelId, message: $message) {
      success
      errors {
        field
        message
      }
      message {
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
  }
`;

export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (
      values,
      { props: { channelId, mutate }, setSubmitting, resetForm },
    ) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }
      await mutate({
        variables: { channelId, message: values.message },
      });
      resetForm(false);
    },
  }),
)(SendMessage);
