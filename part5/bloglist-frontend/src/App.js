import { useState, useEffect } from 'react'
import AddBlog from './components/AddBlog'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import './index.css'

const LogoutButton = ({ handleLogout }) => (
  <button style={{ marginLeft: 10 }} onClick={handleLogout}>Logout</button>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState('')
  const [resCode, setResCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  useEffect(() => {
    const getBlogs = async (user) => {
      const response = await userService.getWithUsername(user.username)
      setBlogs(response.blogs)
    }
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      getBlogs(user)
      blogService.setToken(user.token)
    }
  }, [])

  const cleanBlogForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const cleanLoginForm = () => {
    setUsername('')
    setPassword('')
  }

  const handleNotification = (message, code) => {
    setNotification(message)
    setResCode(code)
    setTimeout(() => {
      setNotification(null)
      setResCode(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      const userObj = await userService.getWithUsername(username)
      const userWithId = { ...user, id: userObj.id }

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(userWithId)
      )
      blogService.setToken(user.token)
      setUser(userWithId)
      setBlogs(userObj.blogs)

      cleanLoginForm()
      handleNotification(`${userObj.username} has successfully logged in.`, 'success')
    } catch (exception) {
      console.log('entered catch')
      handleNotification('Wrong username or password.', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()

    if (!title || !author || !url)
      return handleNotification(`All fields must be filled`, 'error')

    const blogToAdd = {
      title, author, url
    }

    const responseBlog = await blogService.create(blogToAdd)
    setBlogs(blogs.concat(responseBlog))

    handleNotification(`New blog ${blogToAdd.title} by ${blogToAdd.author} has been successfully added.`, 'success')
    cleanBlogForm()
  }

  if (user === null)
    return (
      <div>
        <h2>Login to see your Bloglist</h2>
        <Notification message={notification} className={resCode} />
        <Login
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )

  return (
    <div>
      <h2>Your bloglist:</h2>
      <Notification message={notification} className={resCode} />
      <p>
        {user.name} is logged in.
        <LogoutButton handleLogout={handleLogout} />
      </p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <h2>Add new blog:</h2>
      <AddBlog
        title={{ title, setTitle }}
        author={{ author, setAuthor }}
        url={{ url, setUrl }}
        handleAddBlog={handleAddBlog} />
    </div>
  )
}

export default App