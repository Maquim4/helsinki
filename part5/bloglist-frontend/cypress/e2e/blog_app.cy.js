describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/api/testing/reset`)
    const user = {
      name: 'cristiano',
      username: 'ronaldo',
      password: 'cr7',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/api/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('ronaldo')
      cy.get('#password').type('cr7')
      cy.get('#login-button').click()

      cy.get('html').should('contain', 'cristiano logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('ronaldo')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.not')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'cristiano logged in')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'ronaldo', password: 'cr7' })
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'cypress',
        url: 'www.cypress',
      })
    })

    it('A blog can be created', function () {
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'cypress',
        url: 'www.cypress',
      })
      cy.get('.bloglist').should('contain', 'a blog created by cypress')
    })

    it('Users can like a blog', function () {
      cy.get('.bloglist').children().first().contains('view').click()
      cy.contains('like').click()
      cy.get('.likes').should('contain', 'likes 1')
    })

    it('A blog can be deleted by the creater', function () {
      cy.get('.bloglist').children().first().contains('view').click()
      cy.contains('delete').click()
      cy.get('html').should('not.contain', 'a blog created by cypress')
    })

    it('A blog cannot be deleted by the user', function () {
      cy.contains('logout').click()
      const user = {
        name: 'not_cristiano',
        username: 'not_ronaldo',
        password: 'cr7',
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/api/users`, user)
      cy.login({ username: 'not_ronaldo', password: 'cr7' })

      cy.get('.bloglist').children().first().contains('view').click()

      cy.contains('delete').should('not.exist')
    })

    it('Blogs are ordered according to likes descending', function () {
      cy.get('.bloglist').children().first().contains('view').click()
      cy.contains('like').click()

      cy.createBlog({
        title: 'The title with the second most likes',
        author: 'cypress',
        url: 'www.cypress',
      })

      cy.get('.blog').eq(0).should('contain', 'a blog created by cypress')
      cy.get('.blog')
        .eq(1)
        .should('contain', 'The title with the second most likes')
    })
  })
})
