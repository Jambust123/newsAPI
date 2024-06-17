## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [API link](#api-link)

## Introduction

NC News API is a project that provides a news API. It involves a working databases.

## Getting Started

To get started with this project, you need to clone the repository and create ".env.test" and ".env.development" files. These files are necessary to gain access to the databases.
You will need to run "npm i" in the console in order to install or the NPM packages.
you will also need to run "npm run setup-dbs" in the console to start the databases,
run "npm run seed" in order to seed the databases,
run "npm test (TEST FILE) in order to run the tests.

## Project Structure

This is a summary of the project's directory structure:

Overall Structure:
The project is organized into several key directories, including `__tests__`, `db`, `models`, and `controllers`. The root directory contains essential files such as `README.md`, `app.js`, `endpoints.json`, `error-handling.md`, and `listen.js`. The package manager files are also present, which are packages required for building and testing the application.

Key Directories and Files:

1. `__tests__`: This directory contains test files for the application. `app.test.js` and `utils.test.js` are the test files for the main application and utility functions, respectively.
2. `__utils__`: This directory contains utility functions or shared code snippets that are reused across the project.
3. `db`: This directory contains all the database-related files and folders. The `connection.js` file establishes the database connection, and the `setup.sql` file contains the SQL script for setting up the database schema. The `data` folder contains two subfolders: `development-data` and `test-data`, which contain the initial data for the development and test environments, respectively.
4. `models`: This directory contains the model files for the application's entities. Each model file corresponds to a specific entity, such as `api.models.js`, `articleComments.models.js`, etc.
5. `controllers`: This directory contains the controller files for handling HTTP requests and responses. Each controller file corresponds to a specific API endpoint or a group of related endpoints.

## API link

https://jakesnewsapi.onrender.com/api/

Use the /api endpoint to access a list of all the avaiable endpoints.
