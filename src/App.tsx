import React, { useState } from "react";
import {
  ActionIcon,
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Group,
  Header,
  MantineProvider,
  Text,
} from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";
import { CurrentUserProvider } from "./app-state/UserContext";
import { UserContextConsumer } from "./components/UserContextConsumer";
import { WidgetStateProvider } from "./app-state/WidgetContext";
import { Widget } from "./components/Widget";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          padding="md"
          header={
            <Header height={60} p="xs">
              <Group sx={{ height: "100%" }} px={20} position="apart">
                <Text>React Context Demo</Text>
                <ActionIcon
                  variant="default"
                  onClick={() => toggleColorScheme()}
                  size={30}
                >
                  {colorScheme === "dark" ? (
                    <Sun size={16} />
                  ) : (
                    <MoonStars size={16} />
                  )}
                </ActionIcon>
              </Group>
            </Header>
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
              textAlign: "center",
            },
          })}
        >
          <CurrentUserProvider>
            <UserContextConsumer />
          </CurrentUserProvider>
          <WidgetStateProvider>
            <Widget />
          </WidgetStateProvider>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
