Feature: Root resource
  As a Zetta API consumer
  I want to access the root resource
  So that I can begin my API adventure

Scenario: Accessing the root resource
    Given I am an API consumer of http://45.55.169.202:3000
    When I access the root URL
    Then I should see a class with a "root" value
    And I should see a link to a server named "bork"
