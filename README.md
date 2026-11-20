# Booking Platform API

Appointment booking backend: businesses publish services and working hours, customers book free slots, and double-bookings are impossible.

## Tech stack

NestJS, TypeScript, TypeORM, PostgreSQL, JWT auth, class-validator

## Features

- Owner and customer roles with JWT authentication
- Businesses with services (duration, price) and weekly working hours
- Bookings validated against the business's working hours
- Double-booking prevented at the database level (PostgreSQL exclusion constraint)
- Public free-slots endpoint per service and date
- Customers and owners can list bookings, and either side can cancel

## Getting started

1. Install PostgreSQL and create a database named `booking_app`
2. Run `database/schema.sql` in pgAdmin (it needs the `btree_gist` extension)
3. Copy `.env.example` to `.env` and fill in the values
4. `npm install`
5. `npm run start:dev`

The API runs on `http://localhost:3000`.