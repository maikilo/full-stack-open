const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if (type === 'notification') {
    return (
      <div className='notification'>
        {message}
      </div>
    )
  }
  else if (type === 'error') {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
}

export default Notification
