import React from "react";

// import API mocking utilities from Mock Service Worker
import { rest } from "msw";
import { setupServer } from "msw/node";

// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom";
import { UserProfile } from "../model/UserProfile";
import {
  CurrentUserContext,
  CurrentUserProvider,
  UserContext,
} from "./UserContext";
import { UserContextConsumer } from "../components/UserContextConsumer";

const server = setupServer(
  rest.post("/login", (req, res, ctx) => {
    return res(
      ctx.json<UserProfile>({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@gmail.com",
        settings: {},
        termsAccepted: false,
        username: "johndoe",
      })
    );
  }),
  rest.post("/logout", (req, res, ctx) => {
    return res(ctx.json<boolean>(true));
  }),
  rest.post("/accept", (req, res, ctx) => {
    return res(ctx.json<boolean>(true));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const defaultContext: UserContext = {
  userProfile: null,
  logIn: () => {},
  logOut: () => {},
  acceptTermsAndConditions: () => {},
  updateUserProfile: () => {},
};

describe("UserContextConsumer", () => {
  test("shows the login link when profile is missing", () => {
    render(
      <CurrentUserContext.Provider value={defaultContext}>
        <UserContextConsumer />
      </CurrentUserContext.Provider>
    );
    expect(screen.getByText(/^Log in/)).toBeInTheDocument();
  });

  test("shows the full name, email and log out button when profile is not missing", () => {
    const userContext: UserContext = {
      ...defaultContext,
      userProfile: {
        firstName: "John",
        lastName: "Doe",
        email: "j.doe@domain.com",
        settings: { theme: "dark" },
        termsAccepted: false,
        username: "jdoe",
      },
    };
    render(
      <CurrentUserContext.Provider value={userContext}>
        <UserContextConsumer />
      </CurrentUserContext.Provider>
    );
    expect(screen.queryByText(/^Log in/)).not.toBeInTheDocument();
    expect(screen.getByText(`John Doe (j.doe@domain.com)`)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Log out");
  });

  test(`doesn't allow login if username is empty`, async () => {
    render(
      <CurrentUserProvider>
        <UserContextConsumer />
      </CurrentUserProvider>
    );

    const user = userEvent.setup();
    // type something in the password input box...
    await user.type(screen.getByPlaceholderText(/password/i), "pwd");
    // ...and click the login button
    fireEvent.click(screen.getByText(/^Log in/));

    expect(screen.queryByText(/^Log out/)).not.toBeInTheDocument();
    expect(screen.getByText(/^Log in/)).toBeInTheDocument();
  });

  test(`doesn't allow login if password is empty`, async () => {
    render(
      <CurrentUserProvider>
        <UserContextConsumer />
      </CurrentUserProvider>
    );

    const user = userEvent.setup();
    // type something in the username input box...
    await user.type(screen.getByPlaceholderText(/username/i), "username");
    // ...and click the login button
    fireEvent.click(screen.getByText(/^Log in/));

    expect(screen.queryByText(/^Log out/)).not.toBeInTheDocument();
    expect(screen.getByText(/^Log in/)).toBeInTheDocument();
  });

  test("allows login if username and password are not empty", async () => {
    render(
      <CurrentUserProvider>
        <UserContextConsumer />
      </CurrentUserProvider>
    );

    const user = userEvent.setup();
    // type something in both input boxes...
    await user.type(screen.getByPlaceholderText(/username/i), "jdoe");
    await user.type(screen.getByPlaceholderText(/password/i), "pwd");
    // ...and click the login button
    fireEvent.click(screen.getByText(/^Log in/));

    await screen.findByText(/^Log out/);

    expect(
      screen.getByText(`John Doe (john.doe@gmail.com)`)
    ).toBeInTheDocument();
  });

  test("allows logout after a successful login", async () => {
    render(
      <CurrentUserProvider>
        <UserContextConsumer />
      </CurrentUserProvider>
    );

    const user = userEvent.setup();
    // type something in both input boxes...
    await user.type(screen.getByPlaceholderText(/username/i), "jdoe");
    await user.type(screen.getByPlaceholderText(/password/i), "pwd");
    // ...and click the login button
    fireEvent.click(screen.getByText(/^Log in/));

    // then click the logout button...
    const logoutButton = await screen.findByText(/^Log out/);
    fireEvent.click(logoutButton);

    // ...and wait for the login button to be shown and logout to be hidden
    await screen.findByText(/^Log in/);
    expect(screen.queryByText(/^Log out/)).not.toBeInTheDocument();
  });
});
