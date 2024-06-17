import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextInterface {
  userId: string | undefined;
  username: string | undefined;
  setUserId: (userId: string | undefined) => void;
  setUsername: (username: string | undefined) => void;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

export const useUser = (): UserContextInterface => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | undefined>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const storedUserObj = JSON.parse(storedUser);
      return storedUserObj.userId || undefined;
    }
    return undefined;
  });

  const [username, setUsername] = useState<string | undefined>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const storedUserObj = JSON.parse(storedUser);
      return storedUserObj.username || undefined;
    }
    return undefined;
  });

  useEffect(() => {
    const user = { userId, username };
    if (userId || username) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [userId, username]);

  return (
    <UserContext.Provider value={{ userId, username, setUserId, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
