const BlogForm = ({
  title,
  author,
  url,
  postBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange
}) => {
  return (
    <form onSubmit={postBlog}>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="url"
          onChange={handleUrlChange}
        />
      </div>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm