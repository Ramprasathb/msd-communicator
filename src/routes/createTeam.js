import React from 'react';
import {
  Message,
  Segment,
  Container,
  Header,
  Input,
  Button,
  Form,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateTeam extends React.Component {
  state = {
    name: '',
    loading: false,
    errorMessages: [],
  };

  createTeam = async () => {
    const { name } = this.state;
    if (name.length > 0) {
      this.setState({ loading: true });
      const response = await this.props.mutate({
        variables: { name },
      });
      this.setState({ loading: false });
      const { success, errors } = response.data.createTeam;
      if (success) {
        this.props.history.push('/');
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
        <Header as="h2">Let's form a team! </Header>
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
            <Button type="submit" content="primary" onClick={this.createTeam}>
              Create
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
      errors {
        field
        message
      }
    }
  }
`;

export default graphql(createTeamMutationQuery)(CreateTeam);
