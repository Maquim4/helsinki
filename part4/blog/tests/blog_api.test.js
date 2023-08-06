const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('when there is initially some blogs saved', () => {
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
});

describe('addition of a new blog', () => {
  test('new blog created', async () => {
    const newBlog = {
      title: 'ysl',
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
    expect(titles).toContain('ysl');
  });

  test('default likes property equal zero', async () => {
    const newBlog = {
      title: 'ysl',
      author: 'Larl',
      url: 'https://ru.dotabuff.com/esports/players/106305042-larl',
    };

    await api.post('/api/blogs').send(newBlog).expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const postedBlog = blogsAtEnd.find(({ title }) => title === newBlog.title);

    expect(postedBlog.likes).toBe(0);
  });

  test('blog without url or title is not added', async () => {
    const newBlog = {
      author: 'frfrfrfrfr',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((b) => b.title);

    expect(contents).not.toContain(blogToDelete.title);
  });
});

describe('updating the information of an individual blog post', () => {
  test('update the number of likes for a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpd = blogsAtStart[0];
    blogToUpd.likes += 1;

    await api
      .put(`/api/blogs/${blogToUpd.id}`)
      .send(blogToUpd)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const patchedBlog = blogsAtEnd.find(
      ({ title }) => title === blogToUpd.title
    );

    expect(patchedBlog.likes).toBe(blogToUpd.likes);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
