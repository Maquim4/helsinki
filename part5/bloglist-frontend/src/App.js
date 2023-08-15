import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [info, setInfo] = useState({ message: null });
  const blogFormRef = useRef();

  const notifyWith = (message, type = 'info') => {
    setInfo({
      message,
      type,
    });

    setTimeout(() => {
      setInfo({ message: null });
    }, 3000);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => updateBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const updateBlogs = (blogs) =>
    setBlogs(blogs.sort((a, b) => b.likes - a.likes));

  const handleAddBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        notifyWith(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        );
      })
      .catch((error) => {
        notifyWith(error.response.data.error, 'error');
      });
  };

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject);

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      notifyWith('wrong username or password', 'error');
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const like = async (id) => {
    const blog = blogs.find((b) => b.id === id);

    try {
      const likedBlog = await blogService.update(id, {
        ...blog,
        likes: ++blog.likes,
        user: blog.user.id,
      });
      updateBlogs(blogs.map((blog) => (blog.id !== id ? blog : likedBlog)));
    } catch (exception) {
      notifyWith(exception, 'error');
    }
  };

  const deleteBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    try {
      if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
        await blogService.deleteBlog(id);
        updateBlogs(blogs.filter((blog) => blog.id !== id));
        notifyWith(`Blog ${blog.title} by ${blog.author} deleted`);
      }
    } catch (exception) {
      notifyWith(exception, 'error');
    }
  };

  return (
    <div>
      <Notification info={info} />
      {!user && <LoginForm handleSubmit={handleLogin} />}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={() => logout()}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              handleSubmit={handleAddBlog}
              blogs={blogs}
              notifyWith={notifyWith}
            />
          </Togglable>

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              like={() => like(blog.id)}
              user={user}
              deleteBlog={() => deleteBlog(blog.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
