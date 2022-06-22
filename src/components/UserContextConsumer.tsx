import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../app-state/UserContext";

export const UserContextConsumer = () => {
  const { userProfile, logIn, logOut } = useCurrentUser();
  const [user, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [isLoggingInOut, setIsLoggingInOut] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggingInOut(false);
  }, [userProfile]);

  return (
    <Box sx={{ textAlign: "center" }}>
      {userProfile ? (
        <Group position="center">
          <Text>
            {userProfile.firstName} {userProfile.lastName} ({userProfile.email})
          </Text>
          <Button
            disabled={isLoggingInOut}
            onClick={() => {
              setIsLoggingInOut(true);
              logOut();
            }}
          >
            Log out
          </Button>
        </Group>
      ) : (
        <Group position="center">
          <TextInput
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username"
          />
          <TextInput
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Password"
          />
          <Button
            disabled={user.length === 0 || pwd.length === 0 || isLoggingInOut}
            onClick={() => {
              setIsLoggingInOut(true);
              logIn(user, pwd);
            }}
          >
            Log in
          </Button>
        </Group>
      )}
    </Box>
  );
};
