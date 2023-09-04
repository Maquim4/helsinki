import { useState } from 'react'

const Blog = ({ blog, like, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className="blog" style={blogStyle}>
      {!visible && (
        <div>
          <div className="title">{blog.title}</div>
          <div className="author">{blog.author}</div>

          <button onClick={() => setVisible(!visible)}>view</button>
        </div>
      )}
      {visible && (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(!visible)}>hide</button>
          <div className="url">
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div className="likes">
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
  )
}

export default Blog
