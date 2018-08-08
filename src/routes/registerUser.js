import React from 'react';
import { Message, Segment, Container, Header, Input, Button, Form, Checkbox } from 'semantic-ui-react';
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
  };

  registerUser = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
      conditionError: '',
    });

    const { username, email, password, condition, conditionError } = this.state;

    if (!condition) {
      let error = 'Please accept the terms & conditions';
      this.setState({ conditionError: error });
      return;
    }

    const response = await this.props.mutate({
      variables: { username, email, password },
    });
    const { success, errors } = response.data.registerUser;

    //Redirect user to homepage when registration succeeds
    if (success) {
      this.props.history.push('/');
    } else {
      let fieldError = {};
      errors.forEach(({ field, message }) => {
        fieldError[`${field}Error`] = message;
      });

      this.setState(fieldError);
    }
    console.log('User created : ', response);
  };

  updateInputValues = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  updateTermsAndConditions = checked => {
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
        <Header as="h2">Register User</Header>
        <Segment>
          <Form>
            <Form.Field>
              <label>UserName</label>
              <Input
                icon="user"
                iconPosition="left"
                name="username"
                error={!!usernameError}
                onChange={this.updateInputValues}
                value={username}
                placeholder="Username"
                required
                fluid
              />
            </Form.Field>
            <Form.Field>
              <label required>Email Address</label>
              <Input
                icon="mail"
                iconPosition="left"
                name="email"
                error={!!emailError}
                onChange={this.updateInputValues}
                value={email}
                placeholder="Email Address"
                required
                fluid
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <Input
                icon="key"
                iconPosition="left"
                name="password"
                error={!!passwordError}
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
                onChange={(e, data) => this.updateTermsAndConditions(data.checked)}
              />
            </Form.Field>
            <Button type="submit" onClick={this.registerUser}>
              Register
            </Button>
          </Form>
        </Segment>
        {usernameError.length + emailError.length + passwordError.length + conditionError.length > 0 ? (
          <Message error header="Error while registering" list={errorMessages} />
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
