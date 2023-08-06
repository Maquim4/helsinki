const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('blog posts are returned with the correct amount as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test('new blog created', async () => {
  const newBlog = {
    title: 'xleb',
    author: 'Yatoro',
    likes: 999,
    url: 'https://ru.dotabuff.com/players/321580662',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain('xleb');
});

test('default likes property equal zero', async () => {
  const newBlog = {
    title: 'xleb',
    author: 'Yatoro',
    url: 'https://ru.dotabuff.com/players/321580662',
  };

  await api.post('/api/blogs').send(newBlog).expect(201);

  const blogsAtEnd = await helper.blogsInDb();
  console.log(blogsAtEnd);

  const postedBlog = blogsAtEnd.find(({ title }) => title === newBlog.title);
  console.log(postedBlog);
  expect(postedBlog.likes).toBe(0);
});

test('blog without url or title is not added', async () => {
  const newBlog = {
    author: 'author test',
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
