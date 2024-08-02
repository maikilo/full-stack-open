import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query'
import blogService from '../services/blogs'


const BlogDetails = () => {
  const id = useParams().id
  const queryClient = useQueryClient()

  const likeBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
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

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>likes: {blog.likes}
        <button onClick={() => likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1, user: blog.user.id })}>like</button>
      </p>
      <p>added by: {blog.user.name}</p>
    </div>
  )
}

export default BlogDetails