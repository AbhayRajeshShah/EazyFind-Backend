# EAZYFIND - Restaurant Finder Application

<i>This repo is scoped to the <b>backend</b> of EAZYFIND.</i>

Frontend Implementation of this project can be found [here](https://github.com/AbhayRajeshShah/EazyFind-Frontend).

Eazyfind is a restaurant finder application built with Next.js and TypeScript. It allows users to search for restaurants, apply various filters, and view restaurant details.

## Technologies Used

- Node.js
- Prisma ORM
- PostgreSQL with PostGIS extension
- Docker
- Redis for caching

## Core Features:

- **Smart restaurant search** with multi-filter querying
- **Location-aware results** using reverse geocoding when coordinates are provided
- **Intelligent ranking** by highest `effective_discount` and lowest distance
- **Geospatial queries via PostGIS** for accurate distance calculations
- **Paginated listings** for scalable performance
- **Dockerized backend** with **Redis** for caching and improved response times

## Database Information

- PostgreSQL with PostGIS extension is used for geospatial queries.
- Prisma ORM is used for database interactions.

## Prerequisites

- `Node.js >= 18.x`
- `npm >= 9.x`

## Getting Started

First, build the Docker image:

```bash
docker build -t eazyfind-backend .
```

Then, run the container with the following command:

```bash
docker run -d -p 3003:3003 --name eazyfind-backend --env-file .env eazyfind-backend
```

Refer to the [.env.example](.env.example) file for environment variable configurations.

## Benchmarking Tests

To run the benchmarking tests, use the following command:

```bash
 npm run test
```
