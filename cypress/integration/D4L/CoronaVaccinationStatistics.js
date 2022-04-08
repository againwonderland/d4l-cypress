/// <reference types="Cypress" /> 

// const { parseInt } = require("cypress/types/lodash");
const dayjs = require('dayjs');

// We scroll by default so that the element to act on is centrally placed.
// This makes the selection possible, i.e.,
// the navigation bar at the top does not cover it
Cypress.config('scrollBehavior', 'center')

describe("Validate Vaccinations statistics for Germany", () => {    
    beforeEach( function () {
        // fixtures are reset before each test
        cy.fixture('D4L.json').as('numbers')
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/en/vaccine/corona-vaccine/');
        cy.get('[data-corona-number="today_deutschland_vaccinated"]').as('totalVaccinations')
        cy.get('[data-corona-number="diff_deutschland_vaccinated"]').as('totalVaccinationsYesterday')
        cy.get('[data-corona-number="today_deutschland_vaccinated_to_total_perc"]').as('percentTotalVaccinations')
        cy.get('[data-corona-number="today_deutschland_vaccination_updated"]').as('TimestampVaccinationUpdate')
        // click banner to make more ov the page visible
        cy.get('.js-🍪-accept').click();
    })

    it("First total should be a reasonable number", () => {
        
        cy.get('.select__element').select(0);
        cy.get('@numbers').then( (numbers) => {
            cy.get('@totalVaccinations').first().invoke('text').
                then( $txt => $txt.replaceAll(',','')).
                then(parseInt).
                should('be.greaterThan', numbers.numberOfPeopleVaccinatedUntil20220405-1).
                and('be.lessThan', numbers.numberOfPeopleInGermany)
            })
    })

    it("Both totals should be equal", () => {
        cy.get('@totalVaccinations').then(() => {
            let numFirst = 0
            cy.get('@totalVaccinations').each(($item, $index, $list) => {
                let itemInt = parseInt($item.text().replaceAll(',',''))
                if ($index == 0) {
                    numFirst = itemInt
                } else {
                    expect(itemInt).to.eq(numFirst)
                }
            })
        })
    })

    it("First total of people vaccinated yesterday is a reasonable number", () => {
    cy.get('@numbers').then( (numbers) => {
        cy.get('@totalVaccinationsYesterday').first().invoke('text').
            then( $txt => $txt.replaceAll(',','')).
            then(parseInt).
            should('be.greaterThan', -1).
            and('be.lessThan', numbers.numberOfPeopleInGermany)
        })    
    });

    it("Both totals of people vaccinated yesterday are equal", () => {
        cy.get('@totalVaccinationsYesterday').then(() => {
            let numFirstYesterday = 0
            cy.get('@totalVaccinationsYesterday').each(($item, $index, $list) => {
                let itemIntYesterday = parseInt($item.text().replaceAll(',',''))
                if ($index == 0) {
                    numFirstYesterday = itemIntYesterday
                } else {
                    expect(itemIntYesterday).to.eq(numFirstYesterday)
                }
            })
        })
    });

    it("First percentage of people vaccinated is a reasonable percent", () => {
        cy.get('@numbers').then( (numbers) => {
            cy.get('@percentTotalVaccinations').first().invoke('text').
            then( $txt => $txt.replaceAll('%','')).
            then(parseInt).
            should('be.greaterThan', 0).
            and('be.lessThan', 100)
        })
    });

    it("Both percentages of people vaccinated are equal", () => {
        cy.get('@percentTotalVaccinations').then(() => {
            let numFirstPercent = 0
            cy.get('@percentTotalVaccinations').each(($item, $index, $list) => {
                let itemIntPercent = parseInt($item.text().replaceAll('%',''))
                if ($index == 0) {
                    numFirstPercent = itemIntPercent
                } else {
                    expect(itemIntPercent).to.eq(numFirstPercent)
                }
            })
        })
    });

   it.only("Date of information is today", () => {
       cy.get('@TimestampVaccinationUpdate').invoke('text').
       then((text) => {
           //retrieve current date and format as on the page
           const formattedDate = dayjs().format('MM/DD/YYYY');
           expect(text).to.be.contain(formattedDate)
       });

   });

    it("Totals are the same when user switches the language to German")
    it("Po angielsku jest po angielsku, po niemiecku jest po niemiecku")
    it("User moze wybrac rozne miasta z listy")
    it("A11Y test")
}); 