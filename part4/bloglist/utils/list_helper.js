var _ = require('lodash')

const dummy = (blogs) => {
  return (1)
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))

    const favoriteBlogs = blogs.filter(blog => blog.likes === maxLikes)
    return (favoriteBlogs.map(({ id, url, ...rest }) => rest))
  } else {
    return { error: 'There are no blogs' }
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length > 0) {
    const authorBlogsObj = _.countBy(blogs, (value) => value.author)
    const authorBlogsArr = _.map(authorBlogsObj, (value, key) => ({
      author: key,
      blogs: value
    }))
    const maxBlogs = _.maxBy(authorBlogsArr, 'blogs').blogs
    return _.filter(authorBlogsArr, (author) => author.blogs === maxBlogs)
  } else {
    return { error: 'There are no blogs' }
  }
}

const mostLikes = (blogs) => {
  if (blogs.length > 0) {
    const authorLikes = _(blogs)
      .groupBy('author')
      .map((value, key) => ({
        author: key,
        likes: _.sumBy(value, 'likes')
      }))
      .value()
    const maxLikes = _.maxBy(authorLikes, 'likes').likes
    console.log(_.filter(authorLikes, (author) => author.likes === maxLikes))
    return _.filter(authorLikes, (author) => author.likes === maxLikes)
  } else {
    return { error: 'There are no blogs' }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}