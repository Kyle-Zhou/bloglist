const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

// total likes function tester
describe('total likes', () => {
  test('empty list of blogs is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })
  test('only one blog', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(5)
  })
  test('multiple blogs', () => {
    const blogs = [
      {
        name: "blog",
        likes: 5
      },
      {
        name: "blog",
        likes: 4
      },
      {
        name: "blog",
        likes: 3
      },
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(12)
  })
})

// favourite blog function tester
// note: using toEqual here to compare objects
describe('favourite blog', () => {
  test('empty list of blogs is zero', () => {
    const blogs = []
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual({})
  })
  test('only one blog', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(blogs[0])
  })
  test('multiple blogs', () => {
    const blogs = [
      {
        name: "blog1",
        likes: 5
      },
      {
        name: "blog2",
        likes: 10
      },
      {
        name: "blog3",
        likes: 11
      },
      {
        name: "blog4",
        likes: 9
      },
    ]
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })
})