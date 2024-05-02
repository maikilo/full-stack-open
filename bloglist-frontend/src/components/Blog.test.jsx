import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not blog details', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'me',
    url: 'google.fi',
    likes: 0,
    user: { name: 'Paul', username: 'Paul', id: '283519765' }
  }

  render(<Blog blog={blog} />)
  //screen.debug()

  const element = screen.getByTestId('blog')
  expect(element).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(element).toHaveTextContent(
    'me'
  )

  const togglableContent = screen.getByTestId('togglableContent')
  expect(togglableContent).toHaveStyle(
    'display: none'
  )

})

test('blog details rendered after user clicks view button', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'me',
    url: 'google.fi',
    likes: 0,
    user: { name: 'Paul', username: 'Paul', id: '283519765' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element = screen.getByTestId('togglableContent')
  expect(element).toHaveTextContent(
    'url: google.fi'
  )
  expect(element).toHaveTextContent(
    'likes: 0'
  )
})

test('Liking a blog twice', async() => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'me',
    url: 'google.fi',
    likes: 0,
    user: { name: 'Paul', username: 'Paul', id: '283519765' }
  }

  const addLike = vi.fn()

  render(<Blog blog={blog} addLike={addLike}/>)

  const user = userEvent.setup()
  const element = screen.getByTestId('togglableContent')

  const showButton = screen.getByText('view')
  await user.click(showButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(addLike.mock.calls).toHaveLength(2)

})

