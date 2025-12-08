# Quiz API

## Assignment

The assignment is to build a light weight restful API server to power a quiz UI.

## Functional requirements

 - Implement 2 API resources
   - A Quiz resource, providing at a minimum a title, description and candidate instructions.
   - A Question resource. This should support both free text  and multiple choice questions.
   - Any additional resources you feel are necessary for a functional client experience.
 - The API should follow the [OpenAPI v3](https://swagger.io/specification/) and [JSON:API](https://jsonapi.org/) Specifications.
 - Provide implementations for CRUD operations for all resources.
 - The server should persist data records to a NoSQL database.


## Tech stack

Your solution should be written in typescript. Preferably use an express powered server to host the API.

Feel free to use whatever tools you’re comfortable with (IDE, workflow, AI assistants/LLMs), just as you would in your normal day-to-day work.

This repository has already been bootstrapped to provide the basic project structure, extend it as you need.

## Timebox

You should aim to spend no more than 3 hours. If you don’t finish everything, that’s fine. We’ll talk about trade-offs during the interview.

## Submission

Send a link to the repo, which should contain a short README.md with:

- Instructions to run
- Time spent
- Any trade-offs made and what you would improve with more time

If you choose to use this repository as your base, please do not create a public fork.

## Using this repo

This repository provides a basic application containing an express server with stubbed routes for quiz and question.

To run:

```
npm install
npm run build
npm run start
```

To run in debug:
```
npm install
npm run debug
```
