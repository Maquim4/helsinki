describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'cristiano',
      username: 'ronaldo',
      password: 'cr7',
    };
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
    cy.visit('');
  });

  it('login fails with wrong password', function () {
    cy.contains('log in').click();
    cy.get('#username').type('mluukkai');
    cy.get('#password').type('wrong');
    cy.get('#login-button').click();

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid');

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in');
  });

  it('front page can be opened', function () {
    cy.contains('Notes');
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2023'
    );
  });

  it('login form can be opened', function () {
    cy.contains('log in').click();
  });

  it('user can log in', function () {
    cy.contains('log in').click();
    cy.get('#username').type('ronaldo');
    cy.get('#password').type('cr7');
    cy.get('#login-button').click();

    cy.contains('cristiano logged in');
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'ronaldo', password: 'cr7' });
    });

    it('a new note can be created', function () {
      cy.createNote({
        content: 'a note created by cypress',
        important: true,
      });
      cy.contains('a note created by cypress');
    });

    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false });
        cy.createNote({ content: 'second note', important: false });
        cy.createNote({ content: 'third note', important: false });
      });

      it('one of those can be made important', function () {
        cy.contains('second note').parent().find('button').as('theButton');
        cy.get('@theButton').click();
        cy.get('@theButton').should('contain', 'make not important');
      });
    });
  });
});
