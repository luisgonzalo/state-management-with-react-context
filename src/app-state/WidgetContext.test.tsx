// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom";

// import API mocking utilities from Mock Service Worker
import { rest } from "msw";
import { setupServer } from "msw/node";

import { defaultWidgetContext, WidgetContext } from "./WidgetContext";
import { Widget, SAMPLE_REPORT_URL } from "../components/Widget";

const server = setupServer(
  rest.get(SAMPLE_REPORT_URL, (req, res, ctx) => {
    return res(
      ctx.json({
        ok: true,
        EmbedUrl: "",
        EmbedToken: {
          Token: "",
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("WidgetContext", () => {
  test("shows the Embed Report button enabled", () => {
    render(
      <WidgetContext.Provider value={defaultWidgetContext}>
        <Widget />
      </WidgetContext.Provider>
    );

    const embedButton = screen.getByText(/^Embed Report/);

    expect(embedButton).toBeInTheDocument();
    expect(embedButton).not.toBeDisabled();
  });

  test("change to loading status when Embed button is clicked", async () => {
    render(
      <WidgetContext.Provider value={defaultWidgetContext}>
        <Widget />
      </WidgetContext.Provider>
    );

    const embedButton = screen.getByText(/^Embed Report/);
    fireEvent.click(embedButton);

    await screen.findByText(/loading/);

    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });
});
