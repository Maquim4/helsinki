import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ updateBlogs, blogs }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleAuthorChange = (event) => setAuthor(event.target.value);
  const handleUrlChange = (event) => setUrl(event.target.value);

  const addBlog = (event) => {
    event.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url,
    };

    blogService.create(blogObject).then((returnedBlog) => {
      updateBlogs(blogs.concat(returnedBlog));
      setTitle('');
      setAuthor('');
      setUrl('');
    });
  };

  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        title:
        <input value={title} onChange={handleTitleChange} />
      </div>
      <div>
        author:
        <input value={author} onChange={handleAuthorChange} />
      </div>
      <div>
        url:
        <input value={url} onChange={handleUrlChange} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
