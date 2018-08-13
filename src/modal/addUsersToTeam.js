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

class AddUsersToTeamModal extends React.Component {
  state = {
    loading: false,
    errorMessages: [],
  };

  updateInputValues = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  addUserToTeam = async () => {
    const { email } = this.state;
    const { teamId } = this.props;
    if (email.length > 0) {
      this.setState({ loading: true });
      let response = null;
      try {
        response = await this.props.mutate({
          variables: { email, teamId },
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

      const { success, errors } = response.data.addUserToTeam;
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
    const { open, onClose } = this.props;
    return (
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Add User to this Team</Modal.Header>
        <Modal.Content>
          <Segment vertical loading={loading}>
            <Form>
              <Form.Field>
                <Input
                  onChange={this.updateInputValues}
                  name="email"
                  fluid
                  icon="add"
                  placeholder="User e-mail address"
                />
              </Form.Field>
            </Form>
          </Segment>

          {errorMessages.length > 0 ? (
            <Message
              error
              header="Error while adding user"
              list={errorMessages}
            />
          ) : (
            ''
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.addUserToTeam} basic color="green">
            Add Users
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const addUserToTeamMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addUserToTeam(email: $email, teamId: $teamId) {
      success
      errors {
        field
        message
      }
    }
  }
`;

export default graphql(addUserToTeamMutation)(AddUsersToTeamModal);
