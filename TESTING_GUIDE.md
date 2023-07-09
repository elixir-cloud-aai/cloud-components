# Testing Guide
This is the official testing guide for elixir-cloud-aai cloud-components, please adhere to this guide when writing any tests in this repository

# Table of contents
This guide risks turning into a bit of a blog post, largely because we like to detail our reasoning behind decision-making, but if you'd rather skip to the do's, don't, and best practices, here is a list of all the sections and subsections:
- [Introduction](#introduction)
- [Testing Strategy](#testing-strategy)
    - [What we aim to achieve with testing](#what-we-aim-to-achieve-with-testing)
    - [Testing Environemts](#testing-environments)

# Introduction
Welcome to our humble testing guide. This guide is designed to help you understand the importance of comprehensive web components testing and provide you with what we consider to be some solid guidelines and best practices that ensure the quality and reliability of our web components. 


Testing is crucial in our development process, enabling us to identify and fix issues early, improve code maintainability, and build robust components that other developers can depend on. While static analysis tools like ESLint help catch certain types of errors, a well-designed testing strategy goes beyond static analysis, providing confidence in the behavior and performance of our web components.
In this guide, we will cover various testing techniques, tools, and considerations, some of which are specific to this repository. We will focus on unit testing, integration testing, and end-to-end testing to provide comprehensive coverage and ensure the integrity of our components.

Remember, testing is an ongoing process, and we encourage you to continually update and enhance your tests as the codebase evolves. By fostering a culture of quality and continuous improvement, we can ensure the success and longevity of our web components.

# Testing Strategy
In this section, we will go through key details of our testing strategy namely;
- What we aim to achieve with testing
- Testing environments 
- The types of tests we implement

### What we aim to achieve with testing
While writing tests, we aim to achieve as close to 100% test coverage as we reasonably can. A 100% test coverage can lead to false positives and we'll get into the nuances later, but we want to make sure we are testing as many statements, branches, functions, and lines in our code as necessary and this is a good place to start. Above test coverage, these are the major points you always want to achieve while writing tests;
- **Ensure Components Functionality:** You should always aim to verify that each component behaves in the "correct way", this might seem obvious to you but considering that other people will have to work on your code and even review your code, things as small as making sure the component parses attributes correctly become very important. While testing your component you want to make sure you test its simplest functions from setting attributes correctly to events that might be fired in the components.
- **Catch Bugs and Issues Early:** We encourage a [Test Driven Development(TDD)](https://methodpoet.com/tdd/) approach to writing code. There are many reasons for this, some of which you can find [here](https://methodpoet.com/is-tdd-worth-it/). One main reason is that it helps you catch bugs quickly. It gets a little trickier when working with components, but as long as you know what a button should produce when it is clicked, you should be able to write  a test that checks for that end product before you click the button.
- **Improve Code Maintainability and Facilitate Collaboration:** Your tests should be as self-documenting as possible and should be well broken down, with each block testing a single unit, a single integrated feature, or a single process. This is to ensure confidence while making changes and refactoring components. Your tests will act as a safety net to ensure future modifications do not break existing functionality and the overall integrity of the components.
- **Validate Cross-Browser Compatibility and ensure component reusability:** [End-to-end testing](https://www.browserstack.com/guide/end-to-end-testing) can be annoying and difficult to implement. But for this project, these will be some of our most important tests. These components are going to be used to develop other applications and we can't tell what the developers' environments might look like, therefore it is important that we can catch and pinpoint all compatibility and reusability issues quickly and handle them while limiting unintended side effects.

### Testing environments
This term means different things in different contexts, but for the sake of this guide, we will be considering a **local development environment**, and a [**production-like test environment**](https://notes.nicolevanderhoeven.com/Production-like+environment#:~:text=The%20main%20Entry%20Criteria%20for,the%20instance%20used%20in%20production.).

Depending on the specific tests you're running, you usually need to determine the ideal test environment. Generally, for unit tests and integration tests, a local development environment would be ideal as they allow developers to iterate quickly and run tests during the development process and they provide flexibility and convenience. End-to-end tests can also be carried out in local development environments but are most effective in production-like environments.

### The types of Tests we implement
We generally classify our tests into 3 types, [Unit tests](#unit-testing), [Integration tests](#integration-testing), and [End-to-end tests](#end-to-end-testing). For several reasons, some of which will be explained later in this guide, we separate these tests into different files, but depending on how many integration tests you have it could be advisable to combine them in the same file as the unit tests if they will also run in the same environment and use the same tools.
