import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Ticket, POAP } from "@/lib/types";
import { mockUsers, mockTickets, mockPOAPs } from "@/lib/mockData";

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  tickets: Ticket[];
  poaps: POAP[];
  login: (email: string) => void;
  logout: () => void;
  switchRole: (role: "attendee" | "host") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [poaps] = useState<POAP[]>(mockPOAPs);

  const login = (email: string) => {
    // Simulate login with mock user
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: "attendee",
        createdAt: new Date(),
      };
      setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: "attendee" | "host") => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        tickets,
        poaps,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
