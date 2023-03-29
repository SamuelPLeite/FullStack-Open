import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const user = {
    username: 'samhpl',
    name: 'samuel',
    id: '0001'
  }

  const blog = {
    title: 'One Bad Day',
    author: 'Joshua Schmidt',
    url: 'https://www.onebadday.com/',
    likes: 5,
    user: user,
    id: '1001'
  }

  //  let container
  let mockUpdate
  let mockDelete


  beforeEach(() => {
    mockUpdate = jest.fn()
    mockDelete = jest.fn()

    render(<Blog blog={blog} userid={user.id} handleUpdate={mockUpdate}
      handleDelete={mockDelete} />)
  })

  test('renders title and author, but not url or likes', () => {
    const element = screen.getByText(`${blog.title} by ${blog.author}`)
    expect(element).toBeDefined()

    const url = screen.queryByText('https://www.onebadday.com/')
    const likes = screen.queryByText('Likes:')
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })

  test('renders url and likes when button is clicked', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('View')
    await user.click(viewButton)


    const url = screen.queryByText('https://www.onebadday.com/')
    const likes = screen.queryByText('Likes:')
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  test('calls event handler twice when like button is pressed twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likesButton = screen.getByText('Like')
    await user.click(likesButton)
    await user.click(likesButton)

    expect(mockUpdate.mock.calls).toHaveLength(2)
  })
})

