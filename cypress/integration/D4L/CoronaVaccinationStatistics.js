/// <reference types="Cypress" />

// dayjs is used for date manipulation and calculations
const dayjs = require('dayjs');

// We scroll by default so that the element to act on is centrally placed.
// Without scrollBehavior set to center it is impossible to execute cy.get('.select__label')
// because the element is covered by the menu bar on the top of the view.
Cypress.config('scrollBehavior', 'center')

describe("Validate vaccinations statistics for Germany.", () => {
    beforeEach( function () {
        // fixtures are reset before each test
        cy.fixture('D4L.json').as('numbers');

        // clear cookies and local storage to ensure repeatability
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.visit('/en/vaccine/corona-vaccine/');

        // click banner to make more of the page visible
        cy.get('.js-🍪-accept').click();
    });

    it("First total of vaccinated people should be a reasonable number.", () => {
        cy.get('[data-corona-number="today_deutschland_vaccinated"]').as('totalVaccinations')
        cy.get('.select__element').select(0);
        cy.get('@numbers').then( (numbers) => {
            cy.get('@totalVaccinations').
                first().
                invoke('text').
                then( $txt => $txt.replaceAll(',','')).
                then(parseInt).
                should('be.greaterThan', numbers.numberOfPeopleVaccinatedUntil20220405-1).
                and('be.lessThan', numbers.numberOfPeopleInGermany)
            });
    });

    it("Both totals should be equal.", () => {
        cy.get('[data-corona-number="today_deutschland_vaccinated"]').as('totalVaccinations')
        cy.get('@totalVaccinations').then(() => {
            let numFirst = 0
            cy.get('@totalVaccinations').each(($item, $index, $list) => {
                let itemInt = parseInt($item.text().replaceAll(',',''))
                if ($index == 0) {
                    numFirst = itemInt
                } else {
                    expect(itemInt).to.eq(numFirst)
                }
            });
        });
    });

    it("First total of people vaccinated yesterday is a reasonable number.", () => {
        cy.get('[data-corona-number="diff_deutschland_vaccinated"]').as('totalVaccinationsYesterday')
        cy.get('@numbers').then( (numbers) => {
            cy.get('@totalVaccinationsYesterday').
                first().
                invoke('text').
                then( $txt => $txt.replaceAll(',','')).
                then(parseInt).
                should('be.greaterThan', -1).
                and('be.lessThan', numbers.numberOfPeopleInGermany)
        });
    });

    it("Both totals of people vaccinated yesterday are equal.", () => {
        cy.get('[data-corona-number="diff_deutschland_vaccinated"]').as('totalVaccinationsYesterday')
        cy.get('@totalVaccinationsYesterday').then(() => {
            let numFirstYesterday = 0
            cy.get('@totalVaccinationsYesterday').each(($item, $index, $list) => {
                let itemIntYesterday = parseInt($item.text().replaceAll(',',''))
                if ($index == 0) {
                    numFirstYesterday = itemIntYesterday
                } else {
                    expect(itemIntYesterday).to.eq(numFirstYesterday)
                }
            });
        });
    });

    it("First percentage of people vaccinated is a reasonable percentage.", () => {
        cy.get('[data-corona-number="today_deutschland_vaccinated_to_total_perc"]').as('percentTotalVaccinations')
        cy.get('@numbers').then( (numbers) => {
            cy.get('@percentTotalVaccinations').
            first().
            invoke('text').
            then( $txt => $txt.replaceAll('%','')).
            then(parseInt).
            should('be.greaterThan', 0).
            and('be.lessThan', 100)
        });
    });

    it("Both percentages of people vaccinated are equal.", () => {
        cy.get('[data-corona-number="today_deutschland_vaccinated_to_total_perc"]').as('percentTotalVaccinations')
        cy.get('@percentTotalVaccinations').invoke('text').then(() => {
            let strFirstPercent = ''
            let numFirstPercent = 0
            cy.get('@percentTotalVaccinations').each(($item, $index, $list) => {
                let itemStrPercent = $item.text()
                let itemIntPercent = parseInt(itemStrPercent.replaceAll('.',''))
                if ($index == 0) {
                    numFirstPercent = itemIntPercent
                    strFirstPercent = itemStrPercent
                } else {
                    expect(itemIntPercent).to.eq(numFirstPercent)
                    expect(itemStrPercent).to.eq(strFirstPercent)
                }
            });
        });
    });

    it("Last update of data is not older than maximum number of public holidays in a row.", () => {
        cy.get('[data-corona-number="today_deutschland_vaccination_updated"]').as('TimestampVaccinationUpdate')
        cy.get('@numbers').then( (numbers) => {
            cy.get('@TimestampVaccinationUpdate').
                invoke('text').
                then((text) => text.split(',')).
                then((dateTime) => dateTime[0]).
                should('have.length', 10).
                then((dateOnPage) => {
                    const today = dayjs();
                    expect(dayjs(dateOnPage).isValid(), "date on page should be valid").to.be.true;

                    let upperBound = today.add(1, 'day')
                    // to accommodate running tests on the first workday after the longest public holidays,
                    // we must add +1 to the number maxNumHolidaysInaRowDE.
                    // For example: consider running test at 08 AM on Tuesday 19.04.22.
                    // I assume, that the last update of statistics would happen on Thursday 14.04.22.
                    let lowerBound = today.subtract(numbers.maxNumHolidaysInaRowDE+1, 'day')
                    // check whether the date on page is today or in the past
                    expect(
                        dayjs(dateOnPage).isBefore(upperBound),
                        "date on page should be today or in the past",
                        ).to.be.true;
                    expect(
                        dayjs(dateOnPage).isAfter(lowerBound),
                        "date on page should be no older than 5 days",
                        ).to.be.true;
            });
        });
    });

    it("Selected texts are displayed in the correct language.", () => {
        cy.get('.coronaStatistics__info > h2').as('coronaStatisticsHeader')
        cy.get('.select__label').as('selectLand')
        cy.get('.coronaStatistics__text small').as('statisticsTextSmall')

        // The English page is visited in beforeEach
        cy.get('@coronaStatisticsHeader').invoke('text').should('include', ("Vaccinations statistics for Germany"))
        cy.get('@selectLand').invoke('text').should('include', ("Please select"))
        cy.get('@statisticsTextSmall').invoke('text').should('include', ("Current vaccines require two shots"))

        // Visiting the German page
        cy.visit('/de/impfung/corona-impfung/')
        cy.get('@coronaStatisticsHeader').invoke('text').should('include', ("Impfstatistik für Deutschland"))
        cy.get('@selectLand').invoke('text').should('include', ("Bitte wählen"))
        cy.get('@statisticsTextSmall').invoke('text').should('include', ("Die aktuellen Impfstoffe erfordern eine Zweifachimpfung"))
    });

    it("Totals are the same when user switches the language to German.", () => {
        cy.get('[data-corona-number="today_deutschland_vaccinated"]').as('totalVaccinations')
        cy.get('.select__element').select(0);
        cy.get('@totalVaccinations').first().invoke('text').
            then( $txt => $txt.replaceAll(',','')).
            then(parseInt).
            then( (totalVaccinationsEN) => {
                cy.visit('/de/impfung/corona-impfung/');
                cy.get('.select__element').select(0);

                cy.get('@totalVaccinations').first().invoke('text').
                    then( ($txt) => $txt.replaceAll('.','')).
                    then(parseInt).
                    then((totalVaccinationDE) => expect(totalVaccinationsEN).to.be.eq(totalVaccinationDE));
            });
    });

    it("Total of vaccinated people changes when user selects federal state.", () => {
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
});
