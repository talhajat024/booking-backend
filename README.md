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

## API overview

Protected routes need the header `Authorization: Bearer <token>` (get the token from `POST /auth/login`).

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Create an account (`owner` or `customer`) |
| POST | `/auth/login` | public | Returns a JWT |
| GET | `/auth/profile` | any logged-in user | Current user from the token |
| POST | `/businesses` | owner | Create a business |
| GET | `/businesses/mine` | owner | List my businesses |
| POST | `/businesses/:businessId/services` | owner of that business | Add a service |
| GET | `/businesses/:businessId/services` | public | List services |
| PUT | `/businesses/:businessId/availability` | owner of that business | Set working hours for one weekday |
| DELETE | `/businesses/:businessId/availability/:dayOfWeek` | owner of that business | Remove a weekday's hours |
| GET | `/businesses/:businessId/availability` | public | List working hours |
| GET | `/bookings/slots?serviceId=1&date=2026-11-23` | public | Free slots for a service on a date |
| POST | `/bookings` | customer | Book a slot |
| GET | `/bookings/mine` | customer | My bookings |
| GET | `/bookings/business/:businessId` | owner of that business | Bookings for my business |
| PATCH | `/bookings/:id/cancel` | the customer who booked, or the business owner | Cancel a booking and free the slot |

### Example: create a booking

```json
POST /bookings
{
  "serviceId": 1,
  "startTime": "2026-11-23 10:00"
}
```

Returns `409` if the slot is taken and `400` if it's outside working hours or on a closed day.