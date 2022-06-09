import { useState } from "react";
import { useCurrentUser } from "../app-state/UserContext";

export const UserContextConsumer = () => {
  const { userProfile, logIn, logOut } = useCurrentUser();
  const [user, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");

  return (
    <div>
      {userProfile ? (
        <>
          <span>
            {userProfile.firstName} {userProfile.lastName} ({userProfile.email})
          </span>
          <button onClick={logOut}>Log out</button>
        </>
      ) : (
        <>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Password"
          />
          <button
            disabled={user.length === 0 || pwd.length === 0}
            onClick={() => {
              logIn(user, pwd);
            }}
          >
            Log in
          </button>
        </>
      )}
    </div>
  );
};