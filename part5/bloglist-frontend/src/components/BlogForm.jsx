import { useState } from 'react'

const BlogForm = ({
  postBlog,
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({ target }) => setTitle(target.value)
  const handleAuthorChange = ({ target }) => setAuthor(target.value)
  const handleUrlChange = ({ target }) => setUrl(target.value)

  const addBlog = (event) => {
    event.preventDefault()
    postBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog} className='blogForm' data-testid='blogForm'>
      <div>
        title
        <input
          type='text'
          value={title}
          name='Title'
          data-testid='title'
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author
        <input
          type='text'
          value={author}
          name='Author'
          data-testid='author'
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url
        <input
          type='text'
          value={url}
          name='url'
          data-testid='url'
          onChange={handleUrlChange}
        />
      </div>
      <button type='submit'>save</button>
    </form>
  )
}

export default BlogForm