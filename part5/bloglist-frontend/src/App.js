import { useState, useEffect, useRef } from 'react'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
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


  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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

  const handleAddBlog = async (blogObject) => {
    if (!blogObject.title || !blogObject.author || !blogObject.url)
      return handleNotification('All fields must be filled', 'error')

    const responseBlog = await blogService.create(blogObject)

    console.log({ ...responseBlog, user: user })
    setBlogs(blogs.concat({ ...responseBlog, user: user }))

    handleNotification(`New blog ${blogObject.title} by ${blogObject.author} has been successfully added.`, 'success')
    blogFormRef.current.toggleVisibility()
  }

  const handleUpdateBlog = async (id, blogObject) => {
    if (!blogObject.title || !blogObject.author || !blogObject.url)
      return handleNotification('All fields must be filled', 'error')

    const responseBlog = await blogService.update(id, { ...blogObject, user: blogObject.user.id })

    setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...responseBlog, user: blogObject.user }))
  }

  const handleDeleteBlog = async (id) => {
    await blogService.remove(id)

    handleNotification('Blog has been successfully deleted.', 'success')
    setBlogs(blogs.filter(blog => blog.id !== id))
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
      {blogs.map(x => x).sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} userid={user.id} blog={blog}
          handleUpdate={handleUpdateBlog} handleDelete={handleDeleteBlog} />
      )}
      <h2>Add new blog:</h2>
      <Togglable buttonLabel="Add blog" ref={blogFormRef}>
        <BlogForm handleAddBlog={handleAddBlog} />
      </Togglable>

    </div>
  )
}

export default App