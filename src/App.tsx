import React from "react";
import "./App.css";
import { CurrentUserProvider } from "./app-state/UserContext";
import { UserContextConsumer } from "./components/UserContextConsumer";
import { WidgetStateProvider } from "./app-state/WidgetContext";
import { Widget } from "./components/Widget";

function App() {
  return (
    <div className="App">
      <CurrentUserProvider>
        <UserContextConsumer />
      </CurrentUserProvider>
      <WidgetStateProvider>
        <Widget />
      </WidgetStateProvider>
    </div>
  );
}

export default App;
