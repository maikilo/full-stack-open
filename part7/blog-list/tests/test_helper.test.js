const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const testHelper = require('../utils/test_helper')

after(async () => {
  await mongoose.connection.close()
})

test('dummy returns one', () => {
  const blogs = []

  const result = testHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
	test('totalLikes returns 14', () => {
		const blogs = 
			[
				{
					"title": "First blog post",
					"author": "Jolene",
					"url": "https://google.com",
					"likes": 4,
					"id": "66088277327142132f374c17"
				},
				{
					"title": "Second blog post",
					"author": "Napoleon",
					"url": "https://ft.com",
					"likes": 10,
					"id": "98265065635702752056"
				}
	]
		const result = testHelper.totalLikes(blogs)
		assert.strictEqual(result, 14)
	})
})

describe('favorite blog', () => {
  test('blog with most likes is called Best Blog', () => {
    const blogs = 
    [
      {
        "title": "Best Blog",
        "author": "Writer",
        "likes": 40
      },
      {
        "title": "A Kind of Meh Blog",
        "author": "Scribbler",
        "likes": 3
      }
    ]

    const favoriteBlog = testHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(favoriteBlog, {
      "title": "Best Blog",
      "author": "Writer",
      "likes": 40
    })

  })

})

describe('Author with most blogs', () => {
  test('Paul has most blogs, in total 3', () => {
    const blogs = 
    [
      {
        "title": "Hello Goodbye",
        "author": "Paul",
        "likes": 40
      },
      {
        "title": "Blackbird",
        "author": "Paul",
        "likes": 3
      },
      {
        "title": "Yesterday",
        "author": "Paul",
        "likes": 11
      },
      {
        "title": "Here Comes the Sun",
        "author": "George",
        "likes": 30
      },
      {
        "title": "Norwegian Wood",
        "author": "John",
        "likes": 7
      }
    ]

    const mostBlogs = testHelper.mostBlogs(blogs)
    console.log('mostBlogs', mostBlogs)

    assert.deepStrictEqual(mostBlogs.author, "Paul")

  })
})

describe('Author with most likes', () => {
  test('Paul has most likes, in total 54', () => {
    const blogs = 
    [
      {
        "title": "Hello Goodbye",
        "author": "Paul",
        "likes": 40
      },
      {
        "title": "Blackbird",
        "author": "Paul",
        "likes": 3
      },
      {
        "title": "Yesterday",
        "author": "Paul",
        "likes": 11
      },
      {
        "title": "Here Comes the Sun",
        "author": "George",
        "likes": 30
      },
      {
        "title": "Norwegian Wood",
        "author": "John",
        "likes": 7
      }
    ]

    const mostLikes = testHelper.mostLikes(blogs)
    console.log('mostLikes', mostLikes)

    assert.deepStrictEqual(mostLikes.likes, 54)

  })
})
