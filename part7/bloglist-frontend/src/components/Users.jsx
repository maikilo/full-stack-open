import { Router, Route, Routes, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import getAll from '../services/users'

const Users = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: getAll
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const users = data

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map(user => (
            <tr key={user.username}>
              <td><Link to={`/users/${user.username}`}>{user.name}</Link></td>
              <td align='right'>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users