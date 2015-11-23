Feature: Display device
  As a Zetta API consumer
  I want to make requests to the display device API
  So that I can interact with a physical display screen

Scenario: Executing the "change" action 
    Given I am an API consumer of http://45.55.169.202:3000
    When I access the root URL
    And I go to a server link named "bork"
    And I go to a "display" device
    And I execute the "change" action with input values:
      | Name    | Value       |
      | message | Ahoy there! |
    Then I should see the following properties:
      | Name    | Value       |
      | message | Ahoy there! |
