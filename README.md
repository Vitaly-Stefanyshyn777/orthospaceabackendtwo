# API для адмінки контенту та галереї

## ENV

Створіть `.env` з параметрами:

```
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:3000
```

## Публічні ендпоїнти

- GET `public/content` — список блоків контенту
- GET `public/gallery/albums` — список альбомів
- GET `public/gallery/albums/:slug` — альбом з фото і парами до/після
- GET `public/hero` — hero секція з фоновим зображенням
- GET `public/specialization` — секція "Our specialization" з фото
- GET `public/aboutus` — секція "About us" з фото

## Адмінські ендпоїнти (JWT)

- POST `auth/login`, `auth/logout`, `auth/register`
- POST `auth/request-password-reset`, POST `auth/reset-password`
- CRUD контенту: `GET/POST/PUT/DELETE content`
- Hero секція: `GET/POST/PUT/DELETE hero`, `POST hero/upload-background` (title, subtitle + фото)
- Specialization секція: `GET/POST/PUT/DELETE specialization`, `POST specialization/upload` (title, subtitle, description + фото)
- About Us секція: `GET/POST/PUT/DELETE aboutus`, `POST aboutus/upload` (title, subtitle, description + фото)
- Галерея:
  - Альбоми: `GET/POST/PUT/DELETE gallery/albums`
  - Фото: `GET gallery/albums/:albumId/photos`, `POST gallery/photos`, `PUT/DELETE gallery/photos/:id`
  - Пари: `GET gallery/albums/:albumId/pairs`, `POST gallery/pairs`, `DELETE gallery/pairs/:id`
- Завантаження зображень (Cloudinary): `POST upload/image` (form-data: `file`)

## Безпека

- Rate limiting: 10 запитів/хвилину
- Валідація файлів: тільки зображення (jpg, jpeg, png, gif, webp), макс 5MB
- JWT з httpOnly cookies
- CORS налаштування
- Cloudinary з HTTPS та оптимізацією

## Сидери

```
node -r ts-node/register/transpile-only prisma/seed.ts
```

<p>
  <a href="https://7code.ro/" target="blank"><img src="https://avatars.githubusercontent.com/u/41831998" height="100" alt="7Code Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) + [Prisma](https://github.com/prisma/prisma) + [TypeScript](https://github.com/microsoft/TypeScript) starter repository.

### Production-ready REST API:

- Error Handling (Exception Filters)
- Logging System
- DB Seeds/Migrations
- Built-in AuthModule, using JWT. Route Guards
- Model Events Listener (onCreated, …)
- Deployable. CI/CD pipeline using Github Actions.
- Advanced ESLint/TSLint config. (e.g: auto-fix will remove unused imports)
- Shared services/constants/helpers
- Middlewares/Interceptors implementation example.

## TO-DO

- Add Mail Service
- Add [Recap.DEV](https://recap.dev/) integration - Tracing/Monitoring service
- Add Unit tests.
- Add Social Media Auth
- Add documentation for setting the GitHub Secrets for the CI/CD pipeline
- Add API Throttling - https://docs.nestjs.com/security/rate-limiting
- ...

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Prisma (ORM)

```bash
# IDE for your database
$ npx prisma studio

# run migrations (apply schema changes)
$ npx prisma migrate dev

# run migrations on CI/CD
$ npx prisma migrate deploy

# apply db schema changes to the prisma client
$ npx prisma generate
```

## Auth

This implementation uses `httpOnly` (server-side) cookie-based authentication. [Read more](https://dev.to/guillerbr/authentication-cookies-http-http-only-jwt-reactjs-context-api-and-node-on-backend-industry-structure-3f8e)

That means that the `JWT Token` is never stored on the client.
Usually it was stored in `localStorage` / `sesionStorage` / `cookies` (browser), but this is not secure.

Storing the token on a server side cookie is more secure, but it requires a small adjustment on frontend HTTP requests in order to work.

Frontend adjustments

- If you're using `axios` then you need to set: `withCredentials: true`. [Read more](https://flaviocopes.com/axios-credentials/)
- If you're using `fetch` then you need to set: `credentials: 'include'`. [Read more](https://github.com/github/fetch#sending-cookies)

## Code Style

Sync your IDE with project eslintrc.js.

Check `Run ESLint --fix on save`

## Stay in touch

- Author - [Igor Mardari](https://www.linkedin.com/in/igor-mardari-7code/) | [GarryOne](https://github.com/GarryOne)
- Website - [7code.ro](https://7code.ro/)
- Github - [@7codeRO](https://github.com/7codeRO/)

## License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
