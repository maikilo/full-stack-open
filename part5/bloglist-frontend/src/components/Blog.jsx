import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  return (
    <div style={blogStyle} className='blog' data-testid='blog'>
      <div data-testid='mainContent'>
        {blog.title} {blog.author}
        <button
          style={hideWhenVisible}
          onClick={() => setDetailsVisible(true)}
          data-testid='viewButton'>
            view
        </button>
        <button
          style={showWhenVisible}
          onClick={() => setDetailsVisible(false)}
          data-testid='hideButton'>
            hide
        </button>
      </div>
      <div style={showWhenVisible} data-testid='togglableContent'>
        <p>url: {blog.url}</p>
        <p>likes: {blog.likes}
          <button
            onClick={() => addLike(blog.id)}
            data-testid='likeButton'>
            like
          </button>
        </p>
        <p>user: {blog.user.name}</p>
        <button
          onClick={() => deleteBlog(blog.id)}
          data-testid='deleteButton'>
          delete
        </button>
      </div>

    </div>
  )
}

export default Blog