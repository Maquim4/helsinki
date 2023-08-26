import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('form sent with correct props', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const inputs = screen.getAllByRole('textbox');

  const sendButton = screen.getByText('create');

  await user.type(
    inputs[0],
    'Component testing is done with react-testing-library'
  );
  await user.type(inputs[1], 'Andrey Konohov');
  await user.type(inputs[2], 'www.dede');

  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe(
    'Component testing is done with react-testing-library'
  );
});
