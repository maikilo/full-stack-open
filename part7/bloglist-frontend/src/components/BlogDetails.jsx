import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'


const BlogDetails = () => {
  const notificationDispatch = useNotificationDispatch()

  const setNotification = (payload) => {
    notificationDispatch({ payload, type: 'CREATE' })
    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
  }

  const [comment, setComment] = useState('')
  const handleChange = ({ target }) => setComment(target.value)

  const id = useParams().id

  const queryClient = useQueryClient()

  const changeBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      setNotification( { message: 'An error occured when liking or commenting', messageType: 'error' })
    }
  })

  const { isPending, error, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const blogs = data
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return null
  }

  const addComment = () => {
    if (comment === '') return
    const oldComments = blog.comments ? blog.comments : []
    changeBlogMutation.mutate({ ...blog, comments: [...oldComments, comment], user: blog.user.id })
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>likes: {blog.likes}
        <button onClick={() => changeBlogMutation.mutate({ ...blog, likes: blog.likes + 1, user: blog.user.id })}>like</button>
      </p>
      <p>added by: {blog.user.name}</p>
      <h3>comments</h3>
      <div>
        <input
          type='text'
          value={comment}
          onChange={handleChange}
        />
        <button onClick={addComment}>add comment</button>
      </div>
      <ul>
        {blog.comments.map((comment, index) => <li key={index}>{comment}</li>)}
      </ul>
    </div>
  )
}

export default BlogDetails