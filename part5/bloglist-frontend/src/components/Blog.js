import { useState } from 'react';

const Blog = ({ blog, like, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {!visible && (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(!visible)}>view</button>
        </div>
      )}
      {visible && (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(!visible)}>hide</button>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes}
            <button onClick={like}>like</button>
          </div>
          <div>{blog.user.username}</div>
          {user.username === blog.user.username && (
            <button onClick={deleteBlog}>delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
