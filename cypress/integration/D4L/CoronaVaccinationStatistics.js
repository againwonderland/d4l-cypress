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
        cy.get('.coronaStatistics__info > h2').as('coronaStatisticsHeader')
        cy.get('.select__label').as('selectLand')
        cy.get('[data-corona-number="today_deutschland_vaccination_updated"]').as('coronaStatisticsTextSmall')
        cy.get('.coronaStatistics__text small').as('textSmall')
        // click banner to make more ov the page visible
        cy.get('.js-🍪-accept').click();
    })

    it("First total of vaccinated people should be a reasonable number", () => {
        
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
                let itemIntPercent = parseInt($item.text().replaceAll('%','').replaceAll('.',''))
                if ($index == 0) {
                    numFirstPercent = itemIntPercent
                } else {
                    expect(itemIntPercent).to.eq(numFirstPercent)
                }
            })
        })
    });

   it("Date of information is today (passes when today is a workday)", () => {
       cy.get('@TimestampVaccinationUpdate').invoke('text').
       then((text) => {
           //retrieve current date and format as on the page
           const formattedDate = dayjs().format('MM/DD/YYYY');
           expect(text).to.be.contain(formattedDate)
       });

   });

    it("Texts are displayed in correct language (test of chosen texts)", () => {
        cy.get('@coronaStatisticsHeader').invoke('text').should('include', ("Vaccinations statistics for Germany"))
        cy.get('@selectLand').invoke('text').should('include', ("Please select"))
        cy.get('@textSmall').invoke('text').should('include', ("Current vaccines require two shots"))
        cy.visit('/de/impfung/corona-impfung/')
        cy.get('@coronaStatisticsHeader').invoke('text').should('include', ("Impfstatistik für Deutschland"))
        cy.get('@selectLand').invoke('text').should('include', ("Bitte wählen"))
        cy.get('@textSmall').invoke('text').should('include', ("Die aktuellen Impfstoffe erfordern eine Zweifachimpfung"))
        //cy.visit('/en/vaccine/corona-vaccine/');
    });

    it.only("Totals are the same when user switches the language to German", () => {
        cy.get('.select__element').select(0);
        cy.get('@totalVaccinations').first().invoke('text').
            then( $txt => $txt.replaceAll(',','')).
            then(parseInt).
            as('totalVaccinationsEN');

       cy.visit('/de/impfung/corona-impfung/');
       cy.get('.select__element').select(0);
       
       cy.get('@totalVaccinations').first().invoke('text').
           then( ($txt) => $txt.replaceAll('.','')).
           then(parseInt).
           then((numberDE) => {
               cy.get('@totalVaccinationsEN').should('be.eq',numberDE)
           });       
    });

    it("When user selects Land, total of vaccinated people gets changed", () => {
        cy.get('.select__element').select(3);
        cy.get('[data-corona-number="today_berlin_vaccinated"]').as('totalVaccinationsBerlin')
        cy.get('@numbers').then( (numbers) => {
            cy.get('@totalVaccinationsBerlin').first().invoke('text').
                then( $txt => $txt.replaceAll(',','')).
                then(parseInt).
                should('be.greaterThan', -1).
                and('be.lessThan', numbers.numberOfPeopleInBerlin) 
        });        

    });

    it("A11Y test")
}); 