import React from 'react';
import {
  Button,
  Modal,
  Input,
  Form,
  Message,
  Segment,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';

import { getAllTeamsQuery } from '../query/team.query';

class CreateChannelModal extends React.Component {
  state = {
    loading: false,
    errorMessages: [],
  };

  updateInputValues = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  createChannelForTeam = async () => {
    const { name } = this.state;
    const { teamId } = this.props;
    if (name.length > 0) {
      this.setState({ loading: true });
      let response = null;
      try {
        response = await this.props.mutate({
          variables: { name, teamId },
          update: (store, { data: { createChannel } }) => {
            const { success, channel } = createChannel;
            if (!success) {
              return;
            }
            const data = store.readQuery({ query: getAllTeamsQuery });
            const currentTeamIndex = findIndex(data.allTeams, ['id', teamId]);
            data.allTeams[currentTeamIndex].channels.push(channel);
            store.writeQuery({ query: getAllTeamsQuery, data });
          },
        });
        this.setState({ loading: false });
      } catch (err) {
        const errorMessages = [];
        errorMessages.push('User is not logged in !');
        this.setState({ loading: false, errorMessages });
        setTimeout(() => {
          this.props.onClose();
        }, 2000);
        return;
      }

      const { success, errors, team } = response.data.createChannel;
      if (success) {
        this.props.onClose();
      } else {
        const errorMessages = [];
        errors.forEach(({ field, message }) => {
          errorMessages.push(message);
        });
        this.setState({ errorMessages });
      }
    }
  };

  render() {
    const { loading, errorMessages } = this.state;
    const { open, onClose, teamId } = this.props;
    console.log(this.state);
    return (
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Create a channel for this team</Modal.Header>
        <Modal.Content>
          <Segment vertical loading={loading}>
            <Form>
              <Form.Field>
                <Input
                  onChange={this.updateInputValues}
                  name="name"
                  fluid
                  icon="add"
                  placeholder="Channel name"
                />
              </Form.Field>
            </Form>
          </Segment>

          {errorMessages.length > 0 ? (
            <Message
              error
              header="Error while creating a team"
              list={errorMessages}
            />
          ) : (
            ''
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.createChannelForTeam} basic color="green">
            Create Channel
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const createChannelForTeamMutation = gql`
  mutation($name: String!, $teamId: Int!) {
    createChannel(name: $name, teamId: $teamId) {
      success
      channel {
        id
        name
      }
      errors {
        field
        message
      }
    }
  }
`;

export default graphql(createChannelForTeamMutation)(CreateChannelModal);
