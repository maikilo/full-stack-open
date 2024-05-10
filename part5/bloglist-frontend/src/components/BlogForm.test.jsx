import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('Posting a blog with BlogForm', async() => {
    const postBlog = vi.fn()
    render(<BlogForm postBlog={postBlog} />)

    const user = userEvent.setup()
    const postButton = screen.getByText('save')

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'testing a form...')
    await user.type(inputs[1], 'Anna')
    await user.type(inputs[2], 'https://ft.com')

    await user.click(postButton)

    expect(postBlog.mock.calls).toHaveLength(1)
    expect(postBlog.mock.calls[0][0].title).toBe('testing a form...')
    expect(postBlog.mock.calls[0][0].author).toBe('Anna')
    expect(postBlog.mock.calls[0][0].url).toBe('https://ft.com')

  })
})