const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
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
		const result = listHelper.totalLikes(blogs)
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

    const favoriteBlog = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(favoriteBlog, {
      "title": "Best Blog",
      "author": "Writer",
      "likes": 40
    })

  })

})
