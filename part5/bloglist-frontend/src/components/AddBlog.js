const AddBlog = ({ title, author, url, handleAddBlog }) => (
  <form onSubmit={handleAddBlog}>
    <div>
      Title:
      <input
        type="text"
        value={title.title}
        name="Title"
        onChange={({ target }) => title.setTitle(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <div>
      Author:
      <input
        type="text"
        value={author.author}
        name="Author"
        onChange={({ target }) => author.setAuthor(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <div>
      URL:
      <input
        type="text"
        value={url.url}
        name="URL"
        onChange={({ target }) => url.setUrl(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <button type="submit" style={{ marginTop: 10 }}>Create</button>
  </form>
)

export default AddBlog