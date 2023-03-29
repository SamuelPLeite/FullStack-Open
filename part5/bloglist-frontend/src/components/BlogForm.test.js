import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls event handler with correct details ', async () => {
    const mockSubmit = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm handleAddBlog={mockSubmit} />)

    const inputTitle = screen.getByRole('textbox', { name: 'title' })
    const inputAuthor = screen.getByRole('textbox', { name: 'author' })
    const inputUrl = screen.getByRole('textbox', { name: 'url' })
    const submitButton = screen.getByText('Create')

    await user.type(inputTitle, 'One Bad Day')
    await user.type(inputAuthor, 'Joshua Schmidt')
    await user.type(inputUrl, 'https://www.onebadday.com/')
    await user.click(submitButton)


    const args = mockSubmit.mock.calls[0][0]

    expect(mockSubmit.mock.calls).toHaveLength(1)
    expect(args.title).toBe('One Bad Day')
    expect(args.author).toBe('Joshua Schmidt')
    expect(args.url).toBe('https://www.onebadday.com/')
  })
})