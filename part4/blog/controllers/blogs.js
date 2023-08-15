const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0,
  });

  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' });
  }
  blog.user = user._id;

  let createdBlog = await blog.save();
  createdBlog = await createdBlog.populate('user', { username: 1, name: 1 });
  user.blogs = user.blogs.concat(createdBlog._id);
  await user.save();
  response.status(201).json(createdBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const user = request.user;

  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' });
  }

  user.blogs = user.blogs.filter((b) => b.toString() !== blog.id.toString());

  await user.save();
  await Blog.findByIdAndRemove(blog._id);

  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, url, author, likes, user } = request.body;

  let updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, url, author, likes, user },
    { new: true }
  );
  updatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
