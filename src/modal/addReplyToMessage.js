import React from 'react';
import {
  Form, Input, Button, Modal,
} from 'semantic-ui-react';
import { withFormik } from 'formik';

const AddReplyToMessage = ({
  open,
  onClose,
  username,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Reply to {username}</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            placeholder="Reply with a message"
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button disabled={isSubmitting} fluid onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
            Send reply
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default withFormik({
  mapPropsToValues: () => ({ reply: '' }),
  handleSubmit: async (
    values,
    { props: { onSubmit, messageId }, setSubmitting, resetForm },
  ) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }
    await onSubmit(messageId, values.message);
    resetForm(false);
  },
})(AddReplyToMessage);
