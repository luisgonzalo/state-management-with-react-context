// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom";

// import API mocking utilities from Mock Service Worker
import { rest } from "msw";
import { setupServer } from "msw/node";

import {
  defaultWidgetContext,
  WidgetContext,
  WidgetStateProvider,
} from "./WidgetContext";
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
  test("shows idle state and Embed Report button enabled", () => {
    render(
      <WidgetContext.Provider value={defaultWidgetContext}>
        <Widget />
      </WidgetContext.Provider>
    );

    const embedButton = screen.getByText(/^Embed Report/);

    expect(screen.getByText(/idle/)).toBeInTheDocument();
    expect(embedButton).toBeInTheDocument();
    expect(embedButton).not.toBeDisabled();
  });

  test("when Embed button is clicked, state changes to loading and button is disabled", async () => {
    render(
      <WidgetStateProvider>
        <Widget />
      </WidgetStateProvider>
    );

    const embedButton = screen.getByText(/^Embed Report/);
    fireEvent.click(embedButton);

    await screen.findByText(/loading/);

    expect(screen.getByText(/loading/)).toBeInTheDocument();
    expect(screen.getByText(/^Embed Report/)).toBeDisabled();
  });
});
