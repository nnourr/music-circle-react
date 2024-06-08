import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const IsMobileContext = createContext<boolean | undefined>(undefined);

export const useIsMobile = (): boolean => {
  const context = useContext(IsMobileContext);
  if (context === undefined) {
    throw new Error("useIsMobile must be used within an IsMobileProvider");
  }
  return context;
};

interface IsMobileProviderProps {
  children: ReactNode;
}

export const IsMobileProvider: React.FC<IsMobileProviderProps> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <IsMobileContext.Provider value={isMobile}>
      {children}
    </IsMobileContext.Provider>
  );
};
