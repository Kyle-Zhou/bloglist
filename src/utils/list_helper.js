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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
  