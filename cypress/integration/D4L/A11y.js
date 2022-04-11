/// <reference types="Cypress" />

describe("Validate Vaccinations statistics for Germany", () => {
    beforeEach( function () {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/en/vaccine/corona-vaccine/');
        cy.injectAxe();
    })

    // Define at the top of the spec file or just import it
    const terminalLog = (violations) => {
        cy.task(
          'log',
          `${violations.length} accessibility violation${
            violations.length === 1 ? '' : 's'
          } ${violations.length === 1 ? 'was' : 'were'} detected`
        )
        // pluck specific keys to keep the table readable
        const violationData = violations.map(
          ({ id, impact, description, nodes }) => ({
            id,
            impact,
            description,
            nodes: nodes.length
          })
        )

        cy.task('table', violationData)
      }

    it("Vaccinations statistics for Germany doesn't have detectable a11y violations on load", () => {
        cy.checkA11y('section:nth-of-type(3) > .grid', {
            includedImpacts: ['critical']
          }, terminalLog)
    });
});
