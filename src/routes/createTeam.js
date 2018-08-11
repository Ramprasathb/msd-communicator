import React from 'react';
import {
  Message,
  Segment,
  Container,
  Header,
  Input,
  Button,
  Form,
  Icon,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateTeam extends React.Component {
  state = {
    name: '',
    loading: false,
    errorMessages: [],
  };

  cancelTeamCreation = () => {
    this.props.history.goBack();
  };

  createTeam = async () => {
    const { name } = this.state;
    if (name.length > 0) {
      this.setState({ loading: true });
      let response = null;
      try {
        response = await this.props.mutate({
          variables: { name },
        });
        this.setState({ loading: false });
      } catch (err) {
        const errorMessages = [];
        errorMessages.push('User is not logged in !');
        this.setState({ loading: false, errorMessages });
        setTimeout(() => {
          this.props.history.push('/login');
        }, 2000);
        return;
      }

      const { success, errors, team } = response.data.createTeam;
      if (success) {
        this.props.history.push(`/${team.id}`);
      } else {
        const errorMessages = [];
        errors.forEach(({ field, message }) => {
          errorMessages.push(message);
        });
        this.setState({ errorMessages });
      }
    }
  };

  updateInputValues = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { name, loading, errorMessages } = this.state;
    return (
      <Container text>
        <Header as="h2" icon textAlign="center">
          <Icon name="users" circular />
          <Header.Content>Let's form your team</Header.Content>
        </Header>
        <Segment raised attached loading={loading}>
          <Form>
            <Form.Field>
              <label>Team name</label>
              <Input
                icon="users"
                iconPosition="left"
                name="name"
                onChange={this.updateInputValues}
                value={name}
                placeholder="Give your team a name"
                required
                fluid
              />
            </Form.Field>
            <Button type="submit" onClick={this.createTeam} basic color="green">
              Create
            </Button>
            <Button onClick={this.cancelTeamCreation} floated="right">
              Cancel
            </Button>
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
      </Container>
    );
  }
}

const createTeamMutationQuery = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      success
      team {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

export default graphql(createTeamMutationQuery)(CreateTeam);
