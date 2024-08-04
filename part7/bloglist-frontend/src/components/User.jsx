import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import getAll from '../services/users'


const User = () => {
  const username = useParams().username
  const { isPending, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: getAll
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const users = data
  const user = users.find(u => u.username === username)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </div>
  )
}

export default User