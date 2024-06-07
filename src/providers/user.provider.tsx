import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextInterface {
  email: string | undefined;
  username: string | undefined;
  setEmail: (email: string | undefined) => void;
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
  const [email, setEmail] = useState<string | undefined>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const storedUserObj = JSON.parse(storedUser);
      return storedUserObj.email || undefined;
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
    const user = { email, username };
    if (email || username) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [email, username]);

  return (
    <UserContext.Provider value={{ email, username, setEmail, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
