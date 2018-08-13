import React from 'react';
import {
  Form, Input, Button, Modal, Segment,
} from 'semantic-ui-react';
import Downshift from 'downshift';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const DirectMessageModal = ({
  history,
  open,
  onClose,
  teamId,
  data: { loading, getTeamMembers },
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Message Others</Modal.Header>
    <Modal.Content>
      <Segment vertical loading={loading}>
        <Form>
          <Form.Field>
            {!loading && (
              <Downshift
                onChange={(selectedUser) => {
                  history.push(`/user/${teamId}/${selectedUser.id}`);
                  onClose();
                }}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                }) => (
                  <div>
                    <Input
                      {...getInputProps({
                        placeholder: 'Direct message anyone in your team',
                      })}
                      fluid
                    />
                    {isOpen ? (
                      <div style={{ border: '1px solid #ccc' }}>
                        {getTeamMembers
                          .filter(
                            i => !inputValue
                              || i.username
                                .toLowerCase()
                                .includes(inputValue.toLowerCase()),
                          )
                          .map((item, index) => (
                            <div
                              {...getItemProps({ item })}
                              key={item.id}
                              style={{
                                backgroundColor:
                                  highlightedIndex === index ? 'gray' : 'white',
                                fontWeight:
                                  selectedItem === item ? 'bold' : 'normal',
                              }}
                            >
                              {item.username}
                            </div>
                          ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </Downshift>
            )}
          </Form.Field>
        </Form>
      </Segment>
    </Modal.Content>
    <Modal.Actions>
      <Button basic onClick={onClose}>
        Cancel
      </Button>
    </Modal.Actions>
  </Modal>
);

const getTeamMembersQuery = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
      email
    }
  }
`;

export default withRouter(
  graphql(getTeamMembersQuery, { options: { fetchPolicy: 'network-only' } })(
    DirectMessageModal,
  ),
);
