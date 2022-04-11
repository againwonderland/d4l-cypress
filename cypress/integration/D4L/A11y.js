/// <reference types="Cypress" />

// const { parseInt } = require("cypress/types/lodash");
const dayjs = require('dayjs');

// We scroll by default so that the element to act on is centrally placed.
// This makes the selection possible, i.e.,
// the navigation bar at the top does not cover it
Cypress.config('scrollBehavior', 'center')



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
