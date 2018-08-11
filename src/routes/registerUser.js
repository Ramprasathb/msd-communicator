import React from 'react';
import {
  Message,
  Segment,
  Container,
  Header,
  Input,
  Button,
  Form,
  Checkbox,
  Icon,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class RegisterUser extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    condition: '',
    usernameError: '',
    emailError: '',
    passwordError: '',
    conditionError: '',
    loading: false,
  };

  registerUser = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
      conditionError: '',
    });

    const {
      username, email, password, condition, conditionError,
    } = this.state;

    if (!condition) {
      const error = 'Please accept the terms & conditions';
      this.setState({ conditionError: error });
      return;
    }
    this.setState({ loading: true });
    const response = await this.props.mutate({
      variables: { username, email, password },
    });
    this.setState({ loading: false });
    const { success, errors } = response.data.registerUser;

    //  Redirect user to homepage when registration succeeds
    if (success) {
      this.props.history.push('/login');
    } else {
      const fieldError = {};
      errors.forEach(({ field, message }) => {
        fieldError[`${field}Error`] = message;
      });

      this.setState(fieldError);
    }
  };

  navigateToLoginScreen = () => {
    this.props.history.push('/login');
  };

  updateInputValues = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  updateTermsAndConditions = (checked) => {
    this.setState({ condition: checked });
  };

  render() {
    const {
      username,
      email,
      password,
      condition,
      usernameError,
      emailError,
      passwordError,
      conditionError,
      loading,
    } = this.state;
    const errorMessages = [];

    if (usernameError.length > 0) {
      errorMessages.push(usernameError);
    }
    if (emailError.length > 0) {
      errorMessages.push(emailError);
    }
    if (passwordError.length > 0) {
      errorMessages.push(passwordError);
    }
    if (conditionError.length > 0) {
      errorMessages.push(conditionError);
    }

    return (
      <Container text>
        <Header as="h2" icon textAlign="center">
          <Icon name="add user" circular />
          <Header.Content>Register</Header.Content>
        </Header>
        <Segment raised loading={loading}>
          <Form>
            <Form.Field error={!!usernameError}>
              <label>Username</label>
              <Input
                icon="user"
                iconPosition="left"
                name="username"
                onChange={this.updateInputValues}
                value={username}
                placeholder="Username"
                required
                fluid
              />
            </Form.Field>
            <Form.Field error={!!emailError}>
              <label required>Email Address</label>
              <Input
                icon="mail"
                iconPosition="left"
                name="email"
                onChange={this.updateInputValues}
                value={email}
                placeholder="Email Address"
                required
                fluid
              />
            </Form.Field>
            <Form.Field error={!!passwordError}>
              <label>Password</label>
              <Input
                icon="key"
                iconPosition="left"
                name="password"
                onChange={this.updateInputValues}
                value={password}
                placeholder="Password"
                type="password"
                required
                fluid
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                label="I agree to the Terms and Conditions"
                name="condition"
                onChange={(e, data) => this.updateTermsAndConditions(data.checked)
                }
              />
            </Form.Field>
            <Button
              type="submit"
              onClick={this.registerUser}
              basic
              color="green"
            >
              Register
            </Button>
            <Button
              type="navigate"
              onClick={this.navigateToLoginScreen}
              floated="right"
              icon
              basic
              color="red"
              labelPosition="right"
            >
              Sign In
              <Icon name="right arrow" />
            </Button>
          </Form>
        </Segment>
        {errorMessages.length
        > 0 ? (
          <Message
            error
            header="Error while registering"
            list={errorMessages}
          />
          ) : (
            ''
          )}
      </Container>
    );
  }
}

const registerUserMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      success
      errors {
        field
        message
      }
      user {
        id
      }
    }
  }
`;

export default graphql(registerUserMutation)(RegisterUser);
