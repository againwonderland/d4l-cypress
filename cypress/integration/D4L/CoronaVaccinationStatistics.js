/// <reference types="Cypress" /> 

describe("Validate Vaccinations statistics for Germany", () => {
    before( function () {
        cy.fixture('D4L.json').as('numbers')
    })

    beforeEach( function () {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/en/vaccine/corona-vaccine/');
        cy.get('[data-corona-number="today_deutschland_vaccinated"]').as('totalVaccinations')
        // click banner to make more ov the page visible
        cy.get('.js-🍪-accept').click();
    })

    it("First total should be a reasonable number", () => {
        // we scroll to make the selection in the center, so that
        // the navigation bar at the top does not cover it
        cy.get('.select__element').
            select(0, {scrollBehavior:'center'});
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

    it("Validates the total of people vaccinated yesterday")
    it("First total of people vaccinated yesterday is a reasonable number") 
    it("Both totals of people vaccinated yesterday are equal") 
    it("Validates the percentage of vaccinated people")
    it("First percentage of people vaccinated is a reasonable percent") 
    it("Both percentages of people vaccinated are equal") 
    it("Date of information is today")
    it("Totals are the same when user switches the language to German")
    it("A11Y test")
}); 