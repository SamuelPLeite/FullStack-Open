const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog)
    response.json(blog)
  else
    response.status(404).end()

})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({ ...request.body, user: user._id })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  console.log(blog)

  if (!blog)
    return response.status(204).end()

  if (!(user.id.toString() === blog.user.toString()))
    return response.status(401).json({ error: 'User does not have permission.' })

  await Blog.findByIdAndRemove(request.params.id)

  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())
  await user.save()

  response.status(204).end()
})

module.exports = blogsRouter