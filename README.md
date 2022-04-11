# Cypress Tests for D4L Challenge

## Installation

Installation requires `npm`.
To install Cypress and required libraries, run:

```shell
npm install --save-dev cypress axe-core cypress-axe
```

## Running

To execute all tests run:

```shell
./node_modules/.bin/cypress run --browser chrome --reporter spec
```

## Scope

In the scope of this test suite, I have included:

1. Consistency check of the data (e.g., whether data presented in two separate places have the same values).
2. Basic validation of the data (the total is greater than 0, and less than the population of Germany for the number of vaccinated people in Germany).
3. Accessibility tests of the web page elements.
4. Consistency check of the data when the user loads the web page in English and German.
5. Validation whether the date of the last update is up to date.
6. Validation whether translations in English and German are available for selected texts. 
7. Validation whether the numbers changed when the user selects another value from the dropdown list. 

Out of scope I have left:

1. Performance tests.
1. Any advanced interactions tests (e.g., selecting various federal states from the dropdown list).
1. Validation of data correctness with the source (RKI).
1. Alignment of graphics and texts (e.g., whether the colorful boxes with numbers are vertically aligned).
1. Style and grammatical correctness of displayed texts.
1. Testing for different viewport sizes: desktop, mobile, tablet.


## External materials used for this project

1. [Cypress official documentation](https://docs.cypress.io)
1. [Axe library for A11y testing](https://www.npmjs.com/package/cypress-axe)
1. Stackoverflow or other sources
    1. `"chromeWebSecurity": false` to prevent CORS problems when running headless
    1. Population data of Germany and Berlin has been taken from Wikipedia

If particular block of code was copied from the Internet, there is an explicit note about this in the code with reference to the source where it was taken from.

## Exemplary report

```

====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        9.5.3                                                                          │
  │ Browser:        Chrome 100 (headless)                                                          │
  │ Node Version:   v16.13.1 (/usr/local/bin/node)                                                 │
  │ Specs:          2 found (D4L/A11y.js, D4L/CoronaVaccinationStatistics.js)                      │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  D4L/A11y.js                                                                     (1 of 2)


  Validate Vaccinations statistics for Germany
    ✓ Vaccinations statistics for Germany doesn't have detectable a11y violations on load (1661ms)


  1 passing (2s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        1                                                                                │
  │ Passing:      1                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     1 second                                                                         │
  │ Spec Ran:     D4L/A11y.js                                                                      │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  D4L/CoronaVaccinationStatistics.js                                              (2 of 2)


  Validate vaccinations statistics for Germany.
    ✓ First total of vaccinated people should be a reasonable number. (2659ms)
    ✓ Both totals should be equal. (2285ms)
    ✓ First total of people vaccinated yesterday is a reasonable number. (699ms)
    ✓ Both totals of people vaccinated yesterday are equal. (817ms)
    ✓ First percentage of people vaccinated is a reasonable percentage. (668ms)
    ✓ Both percentages of people vaccinated are equal. (611ms)
    ✓ Last update of data is not older than maximum number of public holidays in a row. (880ms)
    ✓ Selected texts are displayed in the correct language. (1132ms)
    ✓ Totals are the same when user switches the language to German. (1746ms)
    ✓ Total of vaccinated people changes when user selects federal state. (1055ms)


  10 passing (13s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        10                                                                               │
  │ Passing:      10                                                                               │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     12 seconds                                                                       │
  │ Spec Ran:     D4L/CoronaVaccinationStatistics.js                                               │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  D4L/A11y.js                              00:01        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔  D4L/CoronaVaccinationStatistics.js       00:12       10       10        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:14       11       11        -        -        -  


```