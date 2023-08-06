const _ = require('lodash');

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0);
};

const favoriteBlog = (blogs) => {
  const { _id, url, __v, ...clone } = blogs.find(
    (blog) => blog.likes === Math.max(...blogs.map((blog) => blog.likes))
  );
  return clone;
};

const mostBlogs = (blogs) => {
  let result = Object.entries(
    blogs.reduce(
      (acc, cur) => ((acc[cur.author] = ++acc[cur.author] || 1), acc),
      {}
    )
  ).reduce((max, cur) => (max[1] > cur[1] ? max : cur));
  return { author: result[0], blogs: result[1] };
};

const mostLikes = (blogs) => {
  return Object.entries(_.groupBy(blogs, 'author'))
    .map((arr) => _.concat(arr[0], [_.sumBy(arr[1], 'likes')]))
    .reduce(
      (acc, cur) =>
        acc.likes > cur[1] ? acc : { author: cur[0], likes: cur[1] },
      {}
    );
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
