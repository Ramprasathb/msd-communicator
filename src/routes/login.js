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
import _ from 'lodash';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    loading: false,
    errorMessages: [],
  };

  loginUser = async () => {
    const { email, password } = this.state;
    if (!!email && !!password) {
      this.setState({ loading: true });
      const response = await this.props.mutate({
        variables: { email, password },
      });
      this.setState({ loading: false });
      const {
        success, errors, token, refreshToken,
      } = response.data.loginUser;
      if (success) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        this.props.history.push('/');
      } else {
        const errorMessages = [];
        const fieldError = {};
        errors.forEach(({ field, message }) => {
          fieldError[`${field}Error`] = message;
          errorMessages.push(message);
        });
        this.setState({ errorMessages });
        this.setState(fieldError);
      }
    }
  };

  updateInputValues = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const {
      email,
      password,
      loading,
      errorMessages,
      passwordError,
      emailError,
    } = this.state;
    return (
      <Container text>
        <Header as="h2">Let's get to work, Login! </Header>
        <Segment raised attached loading={loading}>
          <Form>
            <Form.Field error={!!emailError}>
              <label>Email Address</label>
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
            <Button type="submit" onClick={this.loginUser}>
              Login
            </Button>
          </Form>
        </Segment>
        {errorMessages.length > 0 ? (
          <Message error header="Error while logging in" list={errorMessages} />
        ) : (
          ''
        )}
      </Container>
    );
  }
}

const userLoginValidationQuery = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      errors {
        field
        message
      }
      token
      refreshToken
    }
  }
`;

export default graphql(userLoginValidationQuery)(Login);
