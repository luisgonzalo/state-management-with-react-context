import { rest, setupWorker } from 'msw'

// Add an extra delay to all endpoints, so loading spinners show up.
const ARTIFICIAL_DELAY_MS = 1000

/* MSW REST API Handlers */

export const handlers = [
  rest.post('/login', function (req, res, ctx) {
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@gmail.com",
        settings: {},
        termsAccepted: false,
        username: "johndoe",
      }))
  }),
  rest.post('/logout', function (req, res, ctx) {
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(true))
  }),
  rest.post('/accept', (req, res, ctx) => {
    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json(true)
    )
  }),
];

export const worker = setupWorker(...handlers);
