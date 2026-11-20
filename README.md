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

## Design decisions

**Double-booking is prevented by the database, not just the code.**
`bookings` has a PostgreSQL `EXCLUDE USING gist` constraint on `(business_id, tsrange(start_time, end_time))`. Two requests arriving at the same instant can't both pass an application-level check, but the database rejects the second one. The API catches error `23P01` and returns `409 Conflict`.

**Cancelling keeps the row.**
Cancel sets `status = 'cancelled'` rather than deleting. The constraint ignores cancelled rows (`WHERE status <> 'cancelled'`), so the slot is freed automatically while booking history stays intact.

**Ownership is enforced in the service layer.**
Guards check the role (`owner` or `customer`), and `assertOwner` checks that the owner actually owns the business in the URL. A customer's identity always comes from the JWT, never from the request body, so users can't act on other people's data.

**The client never sends a business id when booking.**
A booking's business is derived from the chosen service, so a customer can't attach a booking to a business that doesn't offer that service.

**Times are stored as local wall-clock time.**
Bookings use `TIMESTAMP` (no timezone) and are handled as plain `"YYYY-MM-DD HH:MM"` strings, which avoids server-timezone shifts. This assumes a business and its customers share a timezone. Supporting multiple zones would mean adding a `timezone` column (IANA name) to `businesses` and moving to `TIMESTAMPTZ`.

**The schema is hand-written SQL.**
TypeORM runs with `synchronize: false` and the schema lives in `database/schema.sql`, so schema changes are explicit and reviewable rather than applied automatically.

## Roadmap

- React frontend
- AI features: business insights and summaries, an AI booking assistant, smart scheduling
- Multi-timezone support