import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EmailContextType {
  email: string | undefined;
  setEmail: (email: string) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const useEmail = (): EmailContextType => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};

interface EmailProviderProps {
  children: ReactNode;
}

export const EmailProvider: React.FC<EmailProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | undefined>(() => {
    // Get the initial value from local storage
    const storedEmail = localStorage.getItem('userEmail');
    return !!storedEmail ? storedEmail : undefined;
  });

  useEffect(() => {
    // Sync email state to local storage
    if (email) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [email]);

  const handleSetEmail = (email: string | undefined) => {
    setEmail(email);
  };

  return (
    <EmailContext.Provider value={{ email, setEmail: handleSetEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
