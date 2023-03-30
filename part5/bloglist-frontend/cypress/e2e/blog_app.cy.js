describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.adduser({ name: 'user name', username: 'user', password: 'password' })
  })

  it('Login form is shown', function () {
    cy.contains('Login to see your Bloglist')
    cy.contains('Username:')
    cy.contains('Password:')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name="Username"]').type('user')
      cy.get('input[name="Password"]').type('password')
      cy.get('button').click()
      cy.contains('user name is logged in.')
    })

    it('fails with wrong credentials', function () {
      cy.get('input[name="Username"]').type('user')
      cy.get('input[name="Password"]').type('wrongpassword')
      cy.get('button').click()
      cy.contains('Wrong username or password.')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'user', password: 'password' })
      })

      it('A blog can be created', function () {
        cy.contains('Add blog').click()
        cy.get('input[name="Title"]').type('New Blog')
        cy.get('input[name="Author"]').type('Samuel Leite')
        cy.get('input[name="URL"]').type('newblog.blogspot.com')
        cy.contains('Create').click()
        cy.contains('New Blog by Samuel Leite')
        cy.contains('View')
      })

      it('A blog can be liked', function () {
        cy.addblog({ title: 'Blog to test', author: 'Testy T.', url: 'blog.test' })
        cy.contains('View').click()
        cy.get('button').contains('Like').click()
        cy.contains('Likes: 1')
      })

      it('A blog can be deleted', function () {
        cy.addblog({ title: 'New Blog', author: 'Samuel Leite', url: 'newblog.blogspot.com' })
        cy.contains('New Blog by Samuel Leite')
        cy.contains('View').click()
        cy.contains('Remove').click()
        cy.contains('Blog has been successfully deleted.')

      })

      it('A blog can only be deleted by its creator', function () {
        cy.addblog({ title: 'New Blog', author: 'Samuel Leite', url: 'newblog.blogspot.com' })
        cy.contains('New Blog by Samuel Leite')
        cy.contains('View').click()
        cy.contains('Remove')
        cy.contains('Logout').click()
        cy.adduser({ name: 'user name2', username: 'user2', password: 'password' })
        cy.login({ username: 'user2', password: 'password' })
        cy.contains('View').click()
        cy.get('button').should('not.contain', 'Remove')
      })

      it('A blog position is defined by its likes', function () {
        cy.addblog({ title: 'Blog 1', author: 'Samuel Leite', url: 'blog1.blogspot.com' })
        cy.addblog({ title: 'Blog 2', author: 'Samuel Leite', url: 'blog2.blogspot.com' })
        cy.addblog({ title: 'Blog 3', author: 'Samuel Leite', url: 'blog3.blogspot.com' })

        cy.contains('Blog 1').contains('View').click()
        cy.contains('Blog 1 by Samuel Leite').find('button').contains('Like').as('like1')
        cy.contains('Blog 2').contains('View').click()
        cy.contains('Blog 2 by Samuel Leite').find('button').contains('Like').as('like2')
        cy.contains('Blog 3').contains('View').click()
        cy.contains('Blog 3 by Samuel Leite').find('button').contains('Like').as('like3')

        cy.get('@like3').click()
        cy.get('.blog').eq(0).should('contain', 'Blog 3')
        cy.get('@like2').click()
        cy.get('@like2').click()
        cy.get('.blog').eq(0).should('contain', 'Blog 2')
        cy.get('.blog').eq(1).should('contain', 'Blog 3')
        cy.get('@like1').click()
        cy.get('@like1').click()
        cy.get('@like1').click()
        cy.get('.blog').eq(0).should('contain', 'Blog 1')
        cy.get('.blog').eq(1).should('contain', 'Blog 2')
        cy.get('.blog').eq(2).should('contain', 'Blog 3')
      })
    })
  })
})