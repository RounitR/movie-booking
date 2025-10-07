# Movie Booking – Full-Stack Project Roadmap

Vision

- Build a clean, secure, and well-documented Movie Ticket Booking System.
- Backend-first: robust REST API with authentication, booking logic, and Swagger docs.
- Frontend: a simple, intuitive Next.js UI to consume the APIs and demonstrate end-to-end flow.
- Prioritize correctness (booking rules), clarity (API docs), and speed of delivery (1–2 days).

Scope

- Backend per assignment: Django, DRF, JWT (SimpleJWT), Swagger (drf-spectacular).
- Frontend (extra): Next.js app with pages for signup/login, movie list, shows list, booking, my bookings, and cancel.
- DB: SQLite for speed (optional: switch to PostgreSQL for stronger concurrency guarantees).

Tech Stack Choices

- Backend: Python, Django, Django REST Framework, djangorestframework-simplejwt, drf-spectacular, django-cors-headers.
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS for styling, Fetch/axios for API calls.
- Auth: JWT access tokens (Bearer) stored client-side; refresh token endpoint available.
- Testing: DRF APITestCase (unit tests for booking logic).

High-Level Architecture

- Models: Movie (title, duration_minutes), Show (movie FK, screen_name, date_time, total_seats), Booking (user FK, show FK, seat_number, status, created_at).
- Core APIs:
  - POST /signup → register
  - POST /login → JWT token
  - GET /movies/ → list movies
  - GET /movies/<id>/shows/ → list shows
  - POST /shows/<id>/book/ → book seat
  - POST /bookings/<id>/cancel/ → cancel booking
  - GET /my-bookings/ → list user bookings
- Business rules:
  - Prevent double booking (same seat cannot be booked twice while status=booked).
  - Validate seats within 1..total_seats.
  - Cancelling frees the seat (status becomes cancelled).
- Swagger: /swagger/ with clear authentication and schema docs.
- Frontend pages:
  - /signup, /login
  - /movies (list)
  - /movies/[id]/shows (list shows)
  - /shows/[id] (book a seat)
  - /my-bookings (list + cancel)

Execution Plan (Phased)

Phase 0: Repo & scaffolding (Estimated 0.5–1h)
- Initialize Git repo and project structure.
- Create Django project (movie_booking), apps (accounts, bookings).
- Create Next.js app (frontend) within the repo (e.g., /frontend).
- Add requirements.txt and basic README skeleton.
Commit text: "init backend and frontend scaffolds"

Phase 1: Auth backend (Estimated 0.5h)
- Implement /signup endpoint (create user).
- Configure JWT via SimpleJWT; expose /login and /token/refresh.
- Wire up DRF settings and CORS.
Commit text: "add signup and jwt login endpoints"

Phase 2: Core models & booking APIs (Estimated 1.5–2h)
- Define Movie, Show, Booking models.
- Implement endpoints: /movies/, /movies/<id>/shows/.
- Implement booking: /shows/<id>/book/ with validation and business rules.
- Implement cancel: /bookings/<id>/cancel/ with ownership check.
- Implement /my-bookings/.
- Apply migrations.
Commit text: "implement movies, shows, bookings apis"

Phase 3: Swagger docs (Estimated 0.5h)
- Integrate drf-spectacular.
- Configure /schema and /swagger.
- Ensure authentication documented and schemas generated.
Commit text: "add swagger docs at /swagger"

Phase 4: Frontend foundation (Estimated 1h)
- Initialize Next.js with TypeScript and Tailwind.
- Set up API client and auth token handling.
- Build basic layout and routing.
Commit text: "bootstrap nextjs app with tailwind"

Phase 5: Frontend auth pages (Estimated 0.5–1h)
- Implement /signup and /login pages.
- Persist access token (localStorage) and set Authorization header.
- Guard protected routes.
Commit text: "add signup and login ui"

Phase 6: Frontend booking flows (Estimated 1–1.5h)
- /movies page fetches and lists movies.
- /movies/[id]/shows page lists shows.
- /shows/[id] page allows booking a seat.
- /my-bookings page lists bookings and supports cancel.
Commit text: "add movies, shows, booking and cancel ui"

Phase 7: Testing & polish (Estimated 0.5–1h)
- Unit tests for booking logic (double booking, seat range, cancel ownership).
- Error handling and validation messages.
- Minor UI polish; ensure CORS, environment variables, and README.
Commit text: "add tests and polish"

Phase 8: Final QA & submission (Estimated 0.5h)
- Run through expected API flow end-to-end.
- Verify Swagger and all endpoints.
- Finalize README with setup instructions and Swagger link.
- Push to GitHub and share.
Commit text: "final qa and submission"

Detailed Development Roadmap

Backend
- Setup: Django + DRF + SimpleJWT + drf-spectacular + cors-headers.
- Accounts app: Signup API; leverage SimpleJWT for login & refresh.
- Bookings app: Models, serializers, views, URLs for movies, shows, bookings.
- Business rules: seat range validation, double booking prevention, cancel frees seat, ownership checks.
- Concurrency: transaction.atomic and select_for_update (stronger with PostgreSQL).
- Docs: Swagger UI at /swagger.
- Tests: APITestCase covering booking logic and security.

Frontend
- Next.js (App Router) with TypeScript and Tailwind.
- Auth: forms for signup/login; store access token; attach Bearer header.
- Pages: movies list, shows list, booking page, my bookings with cancel.
- UX: clear feedback for success/error; basic responsive layout.

Acceptance Criteria per Phase
- Phase 1–3: All specified APIs work with JWT; Swagger accessible.
- Phase 4–6: User can sign up, log in, browse, book, view, and cancel via UI.
- Phase 7: Tests pass; error messages are clear; README complete.
- Phase 8: End-to-end demo successful and repository ready to share.

Timeline (8–10 hours total)
- Day 1: Phases 0–3 and start Phase 4–5.
- Day 2: Complete Phase 6–8; buffer for fixes.

Notes
- For strict concurrency guarantees, prefer PostgreSQL; otherwise SQLite is fine for this assignment.
- Keep commit messages short and human-like to avoid AI-like verbosity.