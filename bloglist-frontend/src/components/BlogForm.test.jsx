import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'


test('Posting a blog with BlogForm', async() => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'me',
    url: 'google.fi',
    likes: 0,
    user: { name: 'Paul', username: 'Paul', id: '283519765' }
  }

  const postBlog = vi.fn(e => e.preventDefault())
  const handleTitleChange = vi.fn()
  const handleAuthorChange = vi.fn()
  const handleUrlChange = vi.fn()

  render(<BlogForm
    postBlog={postBlog}
    handleTitleChange={handleTitleChange}
    handleAuthorChange={handleAuthorChange}
    handleUrlChange={handleUrlChange} />)

  const user = userEvent.setup()
  const postButton = screen.getByText('save')

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'testing a form...')
  await user.type(inputs[1], 'Anna')
  await user.type(inputs[2], 'https://ft.com')

  await user.click(postButton)

  expect(postBlog.mock.calls).toHaveLength(1)
  expect(postBlog.mock.calls[0][0].content).toBe('testing a form...')

})

