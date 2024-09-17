# 🚀 PDF (Proposal Discussion Forum)

Welcome to the official repository for the PDF backend.

## Table of content:

- [Table of content:](#table-of-content)
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Tech stack:](#tech-stack)
  - [pdf-ui package](#pdf-ui-package)
  - [Backend](#backend)
  - [Database](#database)
- [Getting started](#getting-started)
- [Running locally](#running-locally)
  - [Backend setup](#backend-setup)
  - [Database configuration](#database-configuration)
- [Running using docker compose](#running-using-docker-compose)
- [Overview of services in docker compose:](#overview-of-services-in-docker-compose)
- [Additional Information](#additional-information)

## Introduction

This document serves as a comprehensive guide for setting up the backend and database components of our application.

## Prerequisites

- Node.js installed - [Download link](https://nodejs.org/en/download/).
- PostgreSQL installed (if running locally without Docker) - [Download link](https://www.postgresql.org/).
- Docker and Docker Compose installed (for Docker environment) - [Download link](https://docs.docker.com/get-started/)

## Tech stack:

**Server:** [Node](https://nodejs.org/en/about/), [Strapi](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html)

**Database:** [PostgreSQL](https://www.postgresql.org/)

**Container:** [Docker](https://docs.docker.com/get-started/)

### pdf-ui package

The `@intersect.mbo/pdf-ui` is a React.js package that includes all the necessary logic and UI components required for the operation of a proposal discussion forum.

### Backend

Our backend is powered by Strapi, a versatile headless CMS built on Node.js. It offers an intuitive admin panel, coupled with extensive RESTful and GraphQL API support, enabling efficient content management and API development.

### Database

For data persistence, we utilize PostgreSQL, known for its robustness, scalability, and reliability. This choice ensures that our application's data layer is secure, efficient, and capable of handling growth.

## Getting started

Before you begin setting up the application, you'll need to clone the repository from GitHub to get a local copy of the code. Follow these steps to clone the repository and start setting up the application components:

1. **Clone the Repository:**

   - Open a terminal on your computer.
   - Navigate to the directory where you want to store the project.
   - Run the following command to clone the repository:
     ```
     git clone https://github.com/IntersectMBO/govtool-proposal-pillar.git
     ```

2. **Navigate to the Project Directory:**
   - After cloning, change into the project's root directory:
     ```
     cd govtool-proposal-pillar
     ```
     This directory contains all the files you need to set up the backend.

By cloning the repository, you ensure that you have the latest version of the code and all the necessary files to get started with the application setup.

## Running locally

To run the application locally, you need to have Node.js installed for the backend and frontend parts, as well as the necessary databases. Follow these steps:

### Backend setup

1. **Navigate to the `backend` directory** of the project.
2. **Install dependencies** by running `npm install`.
3. **Configure environment variables** by creating a `.env` file in the backend directory, following the `.env.example` template if available.
4. **Start the Strapi server** in development mode with `npm run develop`, allowing for real-time updates and access to the admin panel.

### Database configuration

1. **Install PostgreSQL** if not already installed and ensure it is running.
2. **Create a new database** for the project, noting down the credentials.
3. **Update the `.env` file** in the backend directory with your database credentials (host, port, username, database name, and password).

## Running using docker compose

Leverage Docker Compose to simplify the process of deploying the full stack of our application, which includes the backend, frontend, and database. Follow these steps to get everything up and running smoothly:

1. **Prerequisites:**

   - Confirm that Docker and Docker Compose are installed on your machine. These tools are essential for creating and managing multi-container Docker applications.

2. **Navigate to your project's root directory:**

   - Open a terminal and change your directory to the root of your project where the `docker-compose.yaml` file is located. This file contains the configuration for all the services that make up your application.

3. **Start services with docker compose:**

   - Execute the following command to start up all the services as defined in your `docker-compose.yaml` file. The `--build` flag ensures that Docker builds fresh images for your services, reflecting any recent changes you might have made.
     ```
     docker-compose up --build
     ```
   - This command will spin up the backend, frontend, and database containers, linking them together based on your configurations.

4. **Accessing the application:**
   - With all services running, your application components should be accessible at the following URLs:
     - **Backend:** `http://localhost:1337` – This is where your Strapi CMS will be accessible for managing content and accessing the API.
     - **Database:** While the database itself won't be directly accessible via a simple URL (since it's meant to be accessed by your backend service), it's running on a mapped port `4321` on your host machine. This setup is specified in your `docker-compose.yaml` file, allowing secure and straightforward connections from your backend service.

### Overview of services in docker compose:

- **Backend service:** Configured to run Strapi on port `1337`, this service automatically connects to the PostgreSQL database, ensuring your CMS has all the data it needs to operate.

- **Database service:** This service runs PostgreSQL and is set to be accessible on port `4321` from the host machine. It's crucial for storing all your application's data securely and efficiently.

By following these steps, you can quickly get your full-stack application running using Docker Compose, ensuring each component is correctly configured and interconnected for optimal performance.

### Additional Information

For more detailed information, check the README files in the corresponding folders:

- [Backend setup](./backend/README.md) - Detailed instructions for setting up the backend part of the application.

- [pdf-ui](./pdf-ui/README.md) - Detailed information regarding the PDF-UI package setup and usage.
