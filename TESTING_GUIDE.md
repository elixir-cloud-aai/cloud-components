# Testing Guide
This is the official testing guide for elixir-cloud-aai cloud-components, please adhere to this guide when writing any tests in this repository

<!--  # Table of contents
- [Introduction](#introduction)
- [Testing Strategy](#testing-strategy) -->

# Introduction
Welcome to our humble testing guide. This guide is designed to help you understand the importance of comprehensive web components testing and provide you with what we consider to be some solid guidelines and best practices that ensure the quality and reliabilty of our web components. 


Testing plays a crucial role in our development process, enabling us to identify and fix issues early, improve code maintainability, and build robust components that other developers can depend on. While static analysis tools like ESLint help catch certain types of errors, a well-designed testing strategy goes beyond static analysis, providing confidence in the behavior and performance of our web components.
In this guide, we will cover various testing techniques, tools, and considerations, some of which are specific to this repository. We will focus on unit testing, integration testing, and end-to-end testing to provide comprehensive coverage and ensure the integrity of our components.

Remember, testing is an ongoing process, and we encourage you to continually update and enhance your tests as the codebase evolves. By fostering a culture of quality and continuous improvement, we can ensure the success and longevity of our web components.

# Testing Strategy
In this section, we will go through key details of our testing strategy namely;
- Testing enviroments 
- Setting up and tearing down tests
- The types of tests we implement
- What we aim to achieve with each test

## Testing environment
Depending on the specific types of test you're running, you ususally need to determine what will be the ideal test environment. We will discuss what we recommend based on the different types of tests further down but due to the tradeoffs of one testing environment over another we don't strictly determine what testing environment you must use, although we have some enrionments that will not be accepted for certain types of tests.
