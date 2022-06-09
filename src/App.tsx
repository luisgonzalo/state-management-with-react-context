import React from "react";
import "./App.css";
import { CurrentUserProvider } from "./app-state/UserContext";
import { UserContextConsumer } from "./components/UserContextConsumer";

function App() {
  return (
    <div className="App">
      <CurrentUserProvider>
        <UserContextConsumer />
      </CurrentUserProvider>
    </div>
  );
}

export default App;
