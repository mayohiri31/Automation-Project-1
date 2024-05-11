beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

describe('Registration form 3 visual tests', () => {
    it('check that the radio button content is correct', () => {

        // Verify labels of the radio buttons
    cy.get('input[type="radio"]').next().eq(0).should("have.text", "Daily");
    cy.get('input[type="radio"]').next().eq(1).should("have.text", "Weekly");
    cy.get('input[type="radio"]')
      .next()
      .eq(2)
      .should("have.text", "Monthly");
    cy.get('input[type="radio"]').next().eq(3).should("have.text", "Never");

    //Verify default state of radio buttons
    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
    cy.get('input[type="radio"]').eq(1).should("not.be.checked");
    cy.get('input[type="radio"]').eq(2).should("not.be.checked");
    cy.get('input[type="radio"]').eq(3).should("not.be.checked");

    // Selecting one will remove selection from the other radio button
    cy.get('input[type="radio"]').eq(0).check().should("be.checked");
    cy.get('input[type="radio"]').eq(1).check().should("be.checked");
    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
});

it('Check that the list of cities changes depending on the choice of country', () => {
    // Select Spain from the country dropdown
    cy.get('#country').select('Spain');
    // Verify that the cities dropdown has updated to include only Spanish cities: Malaga, Madrid, Valencia, and Corralejo
    cy.get('#city').should('contain', 'Malaga')
                           .and('contain', 'Madrid')
                           .and('contain', 'Valencia')
                           .and('contain', 'Corralejo')
  });

  it('Check that if city is already chosen and country is updated, then city choice should be removed', () => {
    // Select Spain and then a city
    cy.get('#country').select('Spain');
    cy.get('#city').select('Madrid');
  
    // Change the country to Estonia
    cy.get('#country').select('Estonia');
  
    // Verify the city dropdown is reset/cleared
    cy.get('#city').should('not.have.value', 'Madrid'); // Checks if the city selection is cleared

});
    
  it('Verify content for checkboxes', () => {
        // Check if two checkboxes exist
        cy.get('input[type="checkbox"]').should('have.length', 2);
    
        // Verify labels and default state
        // Assuming the labels are directly following the checkboxes but not in <label> tags:
        cy.get('input[type="checkbox"]').first().parent().contains('Accept our privacy policy').should('exist');
        cy.get('button').contains('Accept our cookie policy').should('exist');
    
        // Check if both checkboxes are not checked by default
        cy.get('input[type="checkbox"]').first().should('not.be.checked');
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked');
    });
    
    it('Verify links for checkboxes', () => {
    cy.get("button")
      .children()
      .should("be.visible")
      .and("have.attr", "href", "cookiePolicy.html")
      .click();
    });

    it('Check the email input format', () => {
        const validEmail = 'test@example.com';
        const invalidEmail = 'test@';
    
        // Input a valid email and verify it is accepted
        cy.get('input[name="email"]').type(validEmail)
        cy.get('#emailAlert').should('not.be.visible'); // Assuming the alert is hidden when valid
    
        // Clear input and input an invalid email and verify it is rejected
        cy.get('input[name="email"]').clear().type(invalidEmail)
        cy.get('#emailAlert').should('be.visible')
            .and('contain', 'Invalid email address'); // Verify specific error message
    });
    
      
});
/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */


    describe('Registration Form Tests', () => {
        beforeEach(() => {
            // Navigate to the registration page before each test
            cy.visit('cypress/fixtures/registration_form_3.html')
        });
        it.only('User should be able to submit form with all fields filled in', () => {
            inputRegistrationData("name,email,country,city,birthday");
            cy.get('input[type="checkbox"]').first().check().should('be.checked');
            cy.get('input[type="checkbox"]').eq(1).check().should('be.checked');
            cy.get('input[type="radio"]').eq(0).check().should("be.checked");
            cy.contains('Date of registration').next().type('2024-01-05').should('have.value', '2024-01-05')
            cy.get('input[type="submit"]').should('not.be.disabled').click();
            cy.get('h1').should('be.visible').and('contain.text', 'Submission received');
        });
        
        it.only('User should be able to submit when only mandatory fields are filled in', () => {
            inputRegistrationData("name,email,country,city,birthday");
            cy.get('input[type="checkbox"]').first().check().should('be.checked');
            cy.get('input[type="checkbox"]').eq(1).check().should('be.checked');
            cy.get('input[type="submit"]').should('be.enabled').click()
            cy.get('h1').should('be.visible').and('contain.text', 'Submission received');
        });

        it.only('User should be able to submit when only mandatory fields are filled in', () => {
            inputRegistrationData("name,email,country,city,birthday");
            cy.get('.email').clear()
            cy.get('#emailAlert').should('be.visible')
            .and('contain', 'Email is required');
            cy.get('input[type="submit"]').should('not.be.enabled')
        });
    
        });

    
    function inputRegistrationData({name,email,country,city,birthday,
    }) {
        cy.log("Filling out the registration form");
        cy.get('#name').type('John Doe');
        cy.get('.email').type('john@example.com');
        cy.get('#country').select('Spain');
        cy.get('#city').select("Madrid");
        cy.get('#birthday').type("1990-01-01");
        }

    
