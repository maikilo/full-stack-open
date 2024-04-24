import { useState } from 'react'

const Blog = ({ blog }) => {
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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} 
        <button style={hideWhenVisible} onClick={() => setDetailsVisible(true)}>view</button>
        <button style={showWhenVisible} onClick={() => setDetailsVisible(false)}>hide</button>
      </div>  
      <div style={showWhenVisible}>
        <p>url: {blog.url}</p>
        <p>likes: {blog.likes} <button>like</button></p>
         <p>user: {blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog