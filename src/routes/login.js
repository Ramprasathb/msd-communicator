import React from 'react';
import {
  Message, Segment, Container, Header, Input, Button, Form,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    loginError: '',
    loading: true,
  };

  componentDidMount = () => {
    this.setState({ loading: true });
  };

  loginUser = async () => {
    const { email, password } = this.state;
    if (!!email && !!password) {
      const response = await this.props.mutate({
        variables: { email, password },
      });
      const {
        success, errors, token, refreshToken,
      } = response.data.loginUser;
      if (success) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        this.props.history.push('/');
      } else {
        _.forEach(errors, (error) => {
          this.setState({ loginError: error.message });
        });
      }
    }
  };

  updateInputValues = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const {
      email, password, loginError, loading,
    } = this.state;
    const errorMessages = [];

    if (loginError.length > 0) {
      errorMessages.push(loginError);
    }

    return (
      <Container text>
        <Header as="h2">Let's get to work, Login!</Header>
        <Segment raised attached>
          <Form>
            <Form.Field>
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
            <Form.Field>
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
        {loginError.length > 0 ? <Message error header="Error while logging in" list={errorMessages} /> : ''}
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
