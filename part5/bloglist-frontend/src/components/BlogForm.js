import { useState } from 'react'

const BlogForm = ({ handleAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const cleanBlogForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const addBlog = (event) => {
    event.preventDefault()

    const blogToAdd = {
      title, author, url
    }

    handleAddBlog(blogToAdd)
    cleanBlogForm()
  }

  return <form onSubmit={addBlog}>
    <div>
      Title:
      <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <div>
      Author:
      <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <div>
      URL:
      <input
        type="text"
        value={url}
        name="URL"
        onChange={({ target }) => setUrl(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <button type="submit" style={{ marginTop: 10 }}>Create</button>
  </form>
}

export default BlogForm