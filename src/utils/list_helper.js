var _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach(blog => {
    sum += blog.likes;
  })
  return sum
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  let favourite = blogs[0]
  blogs.forEach(blog => {
    if (blog.likes > favourite.likes) {
      favourite = blog;
    }
  })
  return favourite
}

const mostBlogs = (blogs) => {
  const authorArray = _.map(blogs, 'author')
  const mostCommonAuthor = _.head(_(authorArray)    //find the most commonly occurring author value
  .countBy()
  .entries()
  .maxBy(_.last));

  let authorBlogs = 0;
  blogs.forEach(blog => {
    if (blog.author === mostCommonAuthor) {
      authorBlogs += 1;
    }
  })
  return {
    author: mostCommonAuthor,
    blogs: authorBlogs
  }
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}
  