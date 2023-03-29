import { useState } from 'react'
import PropTypes from 'prop-types'

const LikesButton = ({ id, updateLikes }) => (
  <button type="button"
    style={{ marginLeft: 10 }}
    onClick={() => updateLikes(id)}
  >Like</button>
)

const VisilityButton = ({ visible, setVisible }) => (
  <button type="button"
    style={{ marginLeft: 10, marginBottom: 8 }}
    onClick={() => setVisible(!visible)}
  >{visible ? 'Hide' : 'View'}</button>
)

const DeleteButton = ({ userid, blog, deleteBlog }) => (
  userid === blog.user.id ?
    <button type="button"
      style={{ marginLeft: 5, marginBottom: 5 }}
      onClick={() => deleteBlog(blog)}
    >Remove</button> : ''
)

const Blog = ({ blog, userid, handleUpdate, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateLikes = (id) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user,
      likes: blog.likes + 1
    }

    return handleUpdate(id, updatedBlog)
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`))
      return handleDelete(blog.id)
  }

  return <div style={blogStyle}>
    {blog.title} by {blog.author}
    <VisilityButton visible={visible} setVisible={setVisible} />
    <div style={showWhenVisible}>
      <div><b>URL:</b> <a href={blog.url}>{blog.url}</a></div>
      <div><b>Likes:</b> {blog.likes}
        <LikesButton id={blog.id} updateLikes={updateLikes} />
      </div>
      <div><b>Added by:</b> {blog.user.name}</div>
      <div><DeleteButton userid={userid} blog={blog} deleteBlog={deleteBlog} /></div>
    </div>
  </div>
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  userid: PropTypes.string.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Blog