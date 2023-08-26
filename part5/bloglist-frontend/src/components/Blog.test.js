import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders the blog title and author by default', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Andrey Konohov',
    url: 'www.dede',
  };

  const { container } = render(<Blog blog={blog} />);

  const title = container.querySelector('.title');

  expect(title).toHaveTextContent(
    'Component testing is done with react-testing-library'
  );

  const author = container.querySelector('.author');
  expect(author).toHaveTextContent('Andrey Konohov');

  const url = screen.queryByText('www.dede');
  expect(url).toBeNull();
});

test('clicking the button makes url and likes visible', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Andrey Konohov',
    url: 'www.dede',
    user: {
      username: 'maksim',
    },
  };

  const usr = {
    username: 'maksim',
  };

  const { container } = render(<Blog blog={blog} user={usr} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  const url = container.querySelector('.url');

  expect(url).toHaveTextContent('www.dede');

  const like = await screen.findByText('likes');

  expect(like).toBeDefined();
});

test('clicking the like button 2 times calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Andrey Konohov',
    url: 'www.dede',
    user: {
      username: 'maksim',
    },
  };

  const usr = {
    username: 'maksim',
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} user={usr} like={mockHandler} />);

  const user = userEvent.setup();
  const view = screen.getByText('view');
  await user.click(view);

  const like = screen.getByText('like');
  await user.click(like);
  await user.click(like);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
